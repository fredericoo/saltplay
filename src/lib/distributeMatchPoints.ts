import prisma from '@/lib/prisma';
import { Match, User } from '@prisma/client';
import { calculateMatchPoints, STARTING_POINTS } from '@/lib/leaderboard';
import { notifyMatchOnSlack } from '@/lib/slackbot/notifyMatch';

const distributeMatchPoints = async (
  data: Pick<Match, 'gameid' | 'leftscore' | 'rightscore'> & { left: User['id'][]; right: User['id'][] }
) => {
  if (data.left.length === 0 || data.right.length === 0) return 0;

  const leftPoints = await prisma.playerScore.findMany({
    where: {
      gameid: data.gameid,
      playerid: { in: data.left },
    },
    select: { playerid: true, points: true },
  });

  const rightPoints = await prisma.playerScore.findMany({
    where: {
      gameid: data.gameid,
      playerid: { in: data.right },
    },
    select: { playerid: true, points: true },
  });

  const leftAveragePoints = Math.ceil(
    leftPoints.reduce((acc, cur) => acc + (cur.points || STARTING_POINTS), 0) / data.left.length
  );
  const rightAveragePoints = Math.ceil(
    rightPoints.reduce((acc, cur) => acc + (cur.points || STARTING_POINTS), 0) / data.right.length
  );

  const matchPoints = calculateMatchPoints(leftAveragePoints, rightAveragePoints, data.leftscore - data.rightscore);

  if (process.env.ENABLE_SLACK_MATCH_NOTIFICATION) {
    try {
      await notifyMatchOnSlack({
        gameId: data.gameid,
        leftScore: data.leftscore,
        rightScore: data.rightscore,
        left: data.left,
        right: data.right,
      });
    } catch {
      console.error('Failed to notify match on slack');
    }
  }

  if (data.leftscore === data.rightscore) return 0;

  const newScores = [
    ...data.left.map(id => ({
      id,
      newScore:
        (leftPoints.find(p => p.playerid === id)?.points || STARTING_POINTS) +
        matchPoints * (data.leftscore > data.rightscore ? 1 : -1),
    })),
    ...data.right.map(id => ({
      id,
      newScore:
        (rightPoints.find(p => p.playerid === id)?.points || STARTING_POINTS) +
        matchPoints * (data.leftscore < data.rightscore ? 1 : -1),
    })),
  ];

  await Promise.all(
    newScores.map(
      async player =>
        await prisma.playerScore.upsert({
          where: { gameid_playerid: { gameid: data.gameid, playerid: player.id } },
          update: { points: player.newScore },
          create: { points: player.newScore, gameid: data.gameid, playerid: player.id },
        })
    )
  );

  return matchPoints;
};

export default distributeMatchPoints;

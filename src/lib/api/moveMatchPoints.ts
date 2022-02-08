import { STARTING_POINTS } from '@/lib/leaderboard';
import prisma from '@/lib/prisma';
import { Match, User } from '@prisma/client';

/**
 * Moves points from the losing side to the winning side.
 * @param data.gameid The ID of the game.
 * @param data.left The left side of the match.
 * @param data.right The right side of the match.
 * @param data.pointsToMove The number of points to move from the losing side to the winning side.
 * @param data.leftToRight Whether the left side lost.
 * *positive* values move points from the right side to the left side, *negative* values move points from the left side to the right side.
 * @returns true if succeeded, false if failed.
 */
const moveMatchPoints = async (
  data: Pick<Match, 'gameid'> & { left: Pick<User, 'id'>[]; right: Pick<User, 'id'>[] } & {
    pointsToMove: number;
    leftToRight: boolean;
  }
) => {
  if (data.pointsToMove === 0) return true;

  type NewScore = { id: User['id']; operation: 'increment' | 'decrement'; side: 'left' | 'right' };

  const newScores = [
    ...data.left.map<NewScore>(user => ({
      id: user.id,
      operation: data.leftToRight ? 'decrement' : 'increment',
      side: 'left',
    })),
    ...data.right.map<NewScore>(user => ({
      id: user.id,
      operation: data.leftToRight ? 'increment' : 'decrement',
      side: 'right',
    })),
  ];

  return await Promise.all(
    newScores.map(async player => {
      const playerPointsToMove = data.pointsToMove;
      await prisma.playerScore.upsert({
        where: { gameid_playerid: { gameid: data.gameid, playerid: player.id } },
        update: { points: { [player.operation]: playerPointsToMove } },
        create: {
          points: STARTING_POINTS + (player.operation === 'increment' ? playerPointsToMove : -playerPointsToMove),
          gameid: data.gameid,
          playerid: player.id,
        },
      });
    })
  )
    .then(() => true)
    .catch(() => false);
};

export default moveMatchPoints;

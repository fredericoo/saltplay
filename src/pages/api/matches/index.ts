import { calculateMatchPoints, STARTING_POINTS } from '@/lib/leaderboard';
import prisma from '@/lib/prisma';
import { notifyMatchOnSlack } from '@/lib/slackbot/notifyMatch';
import { APIResponse } from '@/lib/types/api';
import { PromiseElement } from '@/lib/types/utils';
import { Match, User } from '@prisma/client';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth/next';
import { nextAuthOptions } from '../auth/[...nextauth]';

const updatePlayersPoints = async (
  data: Pick<Match, 'gameid' | 'leftscore' | 'rightscore'> & { left: Pick<User, 'id'>[]; right: Pick<User, 'id'>[] }
) => {
  const leftPoints = await prisma.playerScore.findMany({
    where: {
      gameid: data.gameid,
      playerid: { in: data.left.map(p => p.id) },
    },
    select: { playerid: true, points: true },
  });

  const rightPoints = await prisma.playerScore.findMany({
    where: {
      gameid: data.gameid,
      playerid: { in: data.right.map(p => p.id) },
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

  if (data.leftscore === data.rightscore) return;

  const newScores = [
    ...data.left.map(player => ({
      id: player.id,
      newScore:
        (leftPoints.find(p => p.playerid === player.id)?.points || STARTING_POINTS) +
        matchPoints * (data.leftscore > data.rightscore ? 1 : -1),
    })),
    ...data.right.map(player => ({
      id: player.id,
      newScore:
        (rightPoints.find(p => p.playerid === player.id)?.points || STARTING_POINTS) +
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

export type MatchesPOSTAPIResponse = APIResponse;

const postHandler: NextApiHandler<MatchesPOSTAPIResponse> = async (req, res) => {
  const session = await getServerSession({ req, res }, nextAuthOptions);
  if (!session) return res.status(401).json({ status: 'error', message: 'Unauthorised' });
  if (!req.body.leftids.includes(session.user.id))
    return res.status(400).json({ status: 'error', message: 'Unauthorised' });

  const leftids = req.body.leftids;
  const rightids = req.body.rightids;

  if (!Array.isArray(leftids) || !Array.isArray(rightids))
    return res
      .status(400)
      .json({ status: 'error', message: 'Invalid request. leftids and rightids must be an array of user ids.' });

  const maxPlayersPerTeam =
    (await prisma.game.findUnique({ where: { id: req.body.gameid } }).then(game => game?.maxPlayersPerTeam)) || 1;
  if (leftids.length > maxPlayersPerTeam || rightids.length > maxPlayersPerTeam)
    return res
      .status(400)
      .json({ status: 'error', message: `Invalid team length. Allowed per team: ${maxPlayersPerTeam}` });

  const matchPoints = await updatePlayersPoints({
    leftscore: req.body.leftscore,
    rightscore: req.body.rightscore,
    left: leftids.map(id => ({ id })),
    right: rightids.map(id => ({ id })),
    gameid: req.body.gameid,
  });

  await prisma.match.create({
    data: {
      createdAt: new Date().toISOString(),
      leftscore: req.body.leftscore,
      rightscore: req.body.rightscore,
      left: { connect: leftids.map(id => ({ id })) },
      right: { connect: rightids.map(id => ({ id })) },
      game: { connect: { id: req.body.gameid } },
      points: matchPoints,
    },
  });

  res.status(200).json({ status: 'ok' });
};

const getMatches = (take: number, cursor?: Pick<Match, 'id'>) =>
  prisma.match.findMany({
    orderBy: { createdAt: 'desc' },
    cursor,
    skip: cursor ? 1 : 0,
    take,
    select: {
      game: {
        select: {
          name: true,
          icon: true,
          office: {
            select: {
              name: true,
            },
          },
        },
      },
      id: true,
      createdAt: true,
      left: { select: { name: true, id: true, image: true } },
      right: { select: { name: true, id: true, image: true } },
      leftscore: true,
      rightscore: true,
    },
  });

export type MatchesGETAPIResponse = APIResponse<{
  matches: PromiseElement<ReturnType<typeof getMatches>>;
  nextCursor?: Match['id'];
}>;

const getHandler: NextApiHandler<MatchesGETAPIResponse> = async (req, res) => {
  const cursor = typeof req.query.cursor === 'string' ? { id: req.query.cursor } : undefined;
  const take = Math.min(+req.query.count, 20) || 3;
  const matches = await getMatches(take, cursor);
  const nextCursor = matches.length >= take ? matches[matches.length - 1].id : undefined;

  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=60');
  res.status(200).json({ status: 'ok', matches, nextCursor });
};

const matchesHandler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') return await postHandler(req, res);
  if (req.method === 'GET') return await getHandler(req, res);
  return res.status(405).json({ status: 'error', message: 'Method not allowed' });
};

export default matchesHandler;

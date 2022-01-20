import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { Match } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { APIResponse } from '@/lib/types/api';
import { PromiseElement } from '@/lib/types/utils';
import distributeMatchPoints from '@/lib/distributeMatchPoints';

export type MatchesPOSTAPIResponse = APIResponse;

const postHandler: NextApiHandler<MatchesPOSTAPIResponse> = async (req, res) => {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ status: 'error', message: 'Unauthorised' });
  if (!req.body.leftids.includes(session.user.id))
    return res.status(400).json({ status: 'error', message: 'Unauthorised' });

  const left = req.body.leftids;
  const right = req.body.rightids;

  if (!Array.isArray(left) || !Array.isArray(right))
    return res
      .status(400)
      .json({ status: 'error', message: 'Invalid request. leftids and rightids must be an array of user ids.' });

  const maxPlayersPerTeam =
    (await prisma.game.findUnique({ where: { id: req.body.gameid } }).then(game => game?.maxPlayersPerTeam)) || 1;
  if (left.length > maxPlayersPerTeam || right.length > maxPlayersPerTeam)
    return res
      .status(400)
      .json({ status: 'error', message: `Invalid team length. Allowed per team: ${maxPlayersPerTeam}` });

  const matchPoints = await distributeMatchPoints({
    leftscore: req.body.leftscore,
    rightscore: req.body.rightscore,
    left,
    right,
    gameid: req.body.gameid,
  });

  await prisma.match.create({
    data: {
      createdAt: new Date().toISOString(),
      leftscore: req.body.leftscore,
      rightscore: req.body.rightscore,
      left: { connect: left.map(id => ({ id })) },
      right: { connect: right.map(id => ({ id })) },
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

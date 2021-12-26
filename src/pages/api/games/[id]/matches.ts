import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { PromiseElement } from '@/lib/types/utils';
import { Match } from '@prisma/client';

type Error = {
  status: 'error';
  message: string;
  matches?: never;
  nextCursor?: never;
};

type Data = {
  status: 'ok';
  message?: never;
  matches: PromiseElement<ReturnType<typeof getGameMatches>>;
  nextCursor?: Match['id'];
};

const getGameMatches = (gameId: string, take: number, cursor?: Pick<Match, 'id'>) =>
  prisma.match.findMany({
    orderBy: { createdAt: 'desc' },
    cursor,
    skip: cursor ? 1 : 0,
    take,
    where: { game: { id: gameId } },
    select: {
      id: true,
      createdAt: true,
      p1: { select: { user: { select: { name: true, id: true, image: true } } } },
      p2: { select: { user: { select: { name: true, id: true, image: true } } } },
      p1score: true,
      p2score: true,
    },
  });

export type GameMatchesAPIResponse = Error | Data;

const gamesHandler: NextApiHandler<GameMatchesAPIResponse> = async (req, res) => {
  const gameId = req.query.id;

  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (typeof gameId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid game id' });

  const cursor = typeof req.query.cursor === 'string' ? { id: +req.query.cursor } : undefined;
  const take = Math.min(+req.query.count, 20) || 3;
  const matches = await getGameMatches(gameId, take, cursor);
  const nextCursor = matches.length >= take ? matches[matches.length - 1].id : undefined;

  res.status(200).json({ status: 'ok', matches, nextCursor });
};

export default gamesHandler;

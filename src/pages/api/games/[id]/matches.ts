import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { PromiseElement } from '@/lib/types/utils';
import { Match } from '@prisma/client';
import { APIResponse } from '@/lib/types/api';

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
      left: { select: { name: true, id: true, image: true } },
      right: { select: { name: true, id: true, image: true } },
      leftscore: true,
      rightscore: true,
    },
  });

export type GameMatchesAPIResponse = APIResponse<{
  matches: PromiseElement<ReturnType<typeof getGameMatches>>;
  nextCursor?: Match['id'];
}>;

const gamesHandler: NextApiHandler<GameMatchesAPIResponse> = async (req, res) => {
  const gameId = req.query.id;

  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (typeof gameId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid game id' });

  const cursor = typeof req.query.cursor === 'string' ? { id: req.query.cursor } : undefined;
  const take = Math.min(+req.query.count, 20) || 3;
  const matches = await getGameMatches(gameId, take, cursor);
  const nextCursor = matches.length >= take ? matches[matches.length - 1].id : undefined;

  // res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=300');
  res.status(200).json({ status: 'ok', matches, nextCursor });
};

export default gamesHandler;

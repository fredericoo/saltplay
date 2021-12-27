import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { PromiseElement } from '@/lib/types/utils';
import { User } from '@prisma/client';
import { APIResponse } from '@/lib/types/api';

const getPlayers = (take: number, cursor?: Pick<User, 'id'>) =>
  prisma.user.findMany({
    orderBy: { name: 'asc' },
    cursor,
    skip: cursor ? 1 : 0,
    take,
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
    },
  });

export type PlayerAPIResponse = APIResponse<{
  players: PromiseElement<ReturnType<typeof getPlayers>>;
  nextCursor?: User['id'];
}>;

const gamesHandler: NextApiHandler<PlayerAPIResponse> = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });

  const cursor = typeof req.query.cursor === 'string' ? { id: req.query.cursor } : undefined;
  const take = Math.min(+req.query.count, 20) || 3;
  const players = await getPlayers(take, cursor);
  const nextCursor = players.length >= take ? players[players.length - 1].id : undefined;

  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600');
  res.status(200).json({ status: 'ok', players, nextCursor });
};

export default gamesHandler;

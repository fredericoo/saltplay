import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { PromiseElement } from '@/lib/types/utils';
import { User } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { APIResponse } from '@/lib/types/api';

const getOpponents = (gameid: string, take: number, cursor?: Pick<User, 'id'>) =>
  prisma.user.findMany({
    cursor,
    skip: cursor ? 1 : 0,
    take,
    select: {
      id: true,
      name: true,
      image: true,
      scores: {
        where: {
          gameid,
        },
      },
    },
  });

export type OpponentsAPIResponse = APIResponse<{
  opponents: PromiseElement<ReturnType<typeof getOpponents>>;
  nextCursor?: User['id'];
}>;

const leaderboardHandler: NextApiHandler<OpponentsAPIResponse> = async (req, res) => {
  const gameId = req.query.id;

  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (typeof gameId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid game id' });

  const session = await getSession({ req });
  if (!session) return res.status(403).json({ status: 'error', message: 'Not logged in' });

  const cursor = typeof req.query.cursor === 'string' ? { id: req.query.cursor } : undefined;
  const take = Math.min(+req.query.count, 20) || 10;
  const opponents = await getOpponents(gameId, take, cursor);
  const nextCursor = opponents.length >= take ? opponents[opponents.length - 1].id : undefined;

  res.status(200).json({ status: 'ok', opponents, nextCursor });
};

export default leaderboardHandler;

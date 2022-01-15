import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { PromiseElement } from '@/lib/types/utils';
import { Match, User } from '@prisma/client';
import { APIResponse } from '@/lib/types/api';

const getPlayerMatches = (userId: User['id'], take: number, cursor?: Pick<Match, 'id'>) =>
  prisma.match.findMany({
    orderBy: { createdAt: 'desc' },
    cursor,
    skip: cursor ? 1 : 0,
    take,
    where: { OR: [{ left: { some: { id: userId } } }, { right: { some: { id: userId } } }] },
    select: {
      id: true,
      createdAt: true,
      left: { select: { name: true, id: true, image: true } },
      right: { select: { name: true, id: true, image: true } },
      leftscore: true,
      rightscore: true,
      game: { select: { name: true, icon: true, office: { select: { name: true } } } },
    },
  });

export type PlayerMatchesAPIResponse = APIResponse<{
  matches: PromiseElement<ReturnType<typeof getPlayerMatches>>;
  nextCursor?: Match['id'];
}>;

const gamesHandler: NextApiHandler<PlayerMatchesAPIResponse> = async (req, res) => {
  const userId = req.query.id;

  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (typeof userId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid user id' });

  const cursor = typeof req.query.cursor === 'string' ? { id: req.query.cursor } : undefined;
  const take = Math.min(+req.query.count, 20) || 3;
  const matches = await getPlayerMatches(userId, take, cursor);
  const nextCursor = matches.length >= take ? matches[matches.length - 1].id : undefined;

  // res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=300');
  res.status(200).json({ status: 'ok', matches, nextCursor });
};

export default gamesHandler;

import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { Match } from '@prisma/client';
import { NextApiHandler } from 'next';

const getOfficeMatches = (officeid: string, take: number, cursor?: Pick<Match, 'id'>) =>
  prisma.match.findMany({
    orderBy: { createdAt: 'desc' },
    cursor,
    skip: cursor ? 1 : 0,
    take,
    where: { game: { officeid } },
    select: {
      id: true,
      createdAt: true,
      left: { select: { name: true, id: true, image: true } },
      right: { select: { name: true, id: true, image: true } },
      leftscore: true,
      rightscore: true,
    },
  });

export type OfficeMatchesAPIResponse = APIResponse<{
  matches: Awaited<ReturnType<typeof getOfficeMatches>>;
  nextCursor?: Match['id'];
}>;

const gamesHandler: NextApiHandler<OfficeMatchesAPIResponse> = async (req, res) => {
  const officeId = req.query.id;

  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (typeof officeId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid game id' });

  const cursor = typeof req.query.cursor === 'string' ? { id: req.query.cursor } : undefined;
  const take = req.query.count ? Math.min(+req.query.count, 20) : 5;
  const matches = await getOfficeMatches(officeId, take, cursor);
  const nextCursor = matches.length >= take ? matches[matches.length - 1].id : undefined;

  // res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=300');
  res.status(200).json({ status: 'ok', data: { matches, nextCursor } });
};

export default gamesHandler;

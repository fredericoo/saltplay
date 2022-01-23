import { Match } from '@prisma/client';
import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { PromiseElement } from '@/lib/types/utils';
import { NextApiHandler } from 'next';

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

const getMatchesHandler: NextApiHandler<MatchesGETAPIResponse> = async (req, res) => {
  const cursor = typeof req.query.cursor === 'string' ? { id: req.query.cursor } : undefined;
  const take = Math.min(+req.query.count, 20) || 3;
  const matches = await getMatches(take, cursor);
  const nextCursor = matches.length >= take ? matches[matches.length - 1].id : undefined;

  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=60');
  res.status(200).json({ status: 'ok', matches, nextCursor });
};

export default getMatchesHandler;

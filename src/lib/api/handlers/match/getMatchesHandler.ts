import { PAGE_SIZE } from '@/constants';
import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { Match } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
import { NextApiHandler } from 'next';
import { InferType, number, object, string } from 'yup';

const isProd = process.env.NODE_ENV === 'production';

const querySchema = object({
  gameId: string(),
  seasonId: string(),
  officeId: string(),
  userId: string(),
  first: number().max(20).default(PAGE_SIZE),
  after: string(),
});

export type GetMatchesOptions = InferType<typeof querySchema>;

const getMatches = ({ first, after, userId, gameId, officeId }: GetMatchesOptions) =>
  prisma.match.findMany({
    orderBy: { createdAt: 'desc' },
    cursor: after ? { id: after } : undefined,
    skip: after ? 1 : 0,
    take: first,
    where: {
      AND: [
        {
          gameid: gameId,
          game: { officeid: officeId },
        },
        { OR: [{ left: { some: { id: userId } } }, { right: { some: { id: userId } } }] },
      ],
    },
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
      seasonid: true,
      createdAt: true,
      left: { select: { name: true, id: true, image: true, roleId: true } },
      right: { select: { name: true, id: true, image: true, roleId: true } },
      leftscore: true,
      rightscore: true,
      points: true,
    },
  });

export type MatchesGETAPIResponse = APIResponse<
  {
    matches: Awaited<ReturnType<typeof getMatches>>;
  },
  { nextCursor?: Match['id'] }
>;

const getMatchesHandler: NextApiHandler<MatchesGETAPIResponse> = async (req, res) => {
  querySchema
    .validate(req.query, { abortEarly: false, stripUnknown: true })
    .then(async options => {
      const matches = await getMatches({ ...options });
      const nextCursor = matches.length >= (options.first || PAGE_SIZE) ? matches[matches.length - 1].id : undefined;

      res.status(200).json({ status: 'ok', data: { matches }, pageInfo: { nextCursor } });
    })
    .catch(err => {
      res.status(400).json({ status: 'error', message: !isProd ? err.message : 'Bad request' });
    });
};

export default withSentry(getMatchesHandler);

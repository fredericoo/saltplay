import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { PromiseElement } from '@/lib/types/utils';
import { Match } from '@prisma/client';
import { NextApiHandler } from 'next';
import { InferType, number, object, string } from 'yup';

const isProd = process.env.NODE_ENV === 'production';

const querySchema = object({
  gameId: string(),
  officeId: string(),
  left: string(),
  right: string(),
  first: number().max(20),
  after: string(),
});

export type GetMatchesOptions = InferType<typeof querySchema>;

const getMatches = ({ first = 5, after, left, right, gameId, officeId }: GetMatchesOptions) =>
  prisma.match.findMany({
    orderBy: { createdAt: 'desc' },
    cursor: after ? { id: after } : undefined,
    skip: after ? 1 : 0,
    take: first,
    where: {
      left: { some: { id: left } },
      right: { some: { id: right } },
      gameid: gameId,
      game: { officeid: officeId },
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
      createdAt: true,
      left: { select: { name: true, id: true, image: true, roleId: true } },
      right: { select: { name: true, id: true, image: true, roleId: true } },
      leftscore: true,
      rightscore: true,
    },
  });

export type MatchesGETAPIResponse = APIResponse<{
  matches: PromiseElement<ReturnType<typeof getMatches>>;
  nextCursor?: Match['id'];
}>;

const getMatchesHandler: NextApiHandler<MatchesGETAPIResponse> = async (req, res) => {
  querySchema
    .validate(req.query, { abortEarly: false })
    .then(async options => {
      const matches = await getMatches({ ...options });
      const nextCursor = matches.length >= (options.first || 5) ? matches[matches.length - 1].id : undefined;

      res.status(200).json({ status: 'ok', matches, nextCursor });
    })
    .catch(err => {
      res.status(400).json({ status: 'error', message: !isProd ? err.message : 'Bad request' });
    });
};

export default getMatchesHandler;

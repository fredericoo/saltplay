import prisma from '@/lib/prisma';
import type { APIResponse } from '@/lib/types/api';
import type { Game, Season } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
import type { NextApiHandler } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from '../../auth/[...nextauth]';

const getOpponents = ({ gameId, seasonId }: { gameId: Game['id']; seasonId?: Season['id'] }) =>
  prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      roleId: true,
      scores: {
        where: {
          gameid: gameId,
          ...(seasonId && { seasonid: seasonId }),
        },
      },
    },
  });

export type Opponents = Awaited<ReturnType<typeof getOpponents>>;
export type OpponentsAPIResponse = APIResponse<{
  opponents: Opponents;
}>;

const leaderboardHandler: NextApiHandler<OpponentsAPIResponse> = async (req, res) => {
  const gameId = req.query.id;
  const seasonId = typeof req.query.seasonId === 'string' ? req.query.seasonId : undefined;

  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (typeof gameId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid game id' });

  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  if (!session) return res.status(403).json({ status: 'error', message: 'Not logged in' });
  const opponents = await getOpponents({ gameId, seasonId });

  res.status(200).json({ status: 'ok', data: { opponents } });
};

export default withSentry(leaderboardHandler);

export const config = {
  api: {
    externalResolver: true,
  },
};

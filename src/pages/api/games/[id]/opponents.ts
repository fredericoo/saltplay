import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { NextApiHandler } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from '../../auth/[...nextauth]';

const getOpponents = (gameid: string) =>
  prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      roleId: true,
      scores: {
        where: {
          gameid,
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

  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (typeof gameId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid game id' });

  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  if (!session) return res.status(403).json({ status: 'error', message: 'Not logged in' });
  const opponents = await getOpponents(gameId);

  res.status(200).json({ status: 'ok', data: { opponents } });
};

export default leaderboardHandler;

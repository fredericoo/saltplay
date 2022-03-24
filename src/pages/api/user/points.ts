import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { Game, User } from '@prisma/client';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth/next';
import { nextAuthOptions } from '../auth/[...nextauth]';

const getUserPoints = async (playerid: User['id'], gameid: Game['id']) => {
  const user = await prisma.playerScore.findUnique({
    where: { gameid_playerid: { gameid, playerid } },
    select: { points: true },
  });
  return user?.points || null;
};

export type PlayerPointsAPIResponse = APIResponse<{
  points: Awaited<ReturnType<typeof getUserPoints>>;
}>;

const pointsHandler: NextApiHandler<PlayerPointsAPIResponse> = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (typeof req.query.gameid !== 'string') return res.status(400).json({ status: 'error', message: 'Missing gameid' });

  const session = await getServerSession({ req, res }, nextAuthOptions);
  if (!session?.user.id) return res.status(401).json({ status: 'error', message: 'Not logged in' });

  const points = await getUserPoints(session?.user?.id, req.query.gameid);

  res.status(200).json({ status: 'ok', points });
};

export default pointsHandler;

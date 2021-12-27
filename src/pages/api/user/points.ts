import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { PromiseElement } from '@/lib/types/utils';
import { Game, User } from '@prisma/client';
import { getSession } from 'next-auth/react';

type Error = {
  status: 'error';
  message: string;
  points?: never;
};

type Data = {
  status: 'ok';
  message?: never;
  points: PromiseElement<ReturnType<typeof getUserPoints>>;
};

const getUserPoints = async (playerid: User['id'], gameid: Game['id']) => {
  const user = await prisma.playerScore.findUnique({
    where: { gameid_playerid: { gameid, playerid } },
    select: { points: true },
  });
  return user?.points || null;
};

export type PlayerPointsAPIResponse = Error | Data;

const pointsHandler: NextApiHandler<PlayerPointsAPIResponse> = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (typeof req.query.gameid !== 'string') return res.status(400).json({ status: 'error', message: 'Missing gameid' });

  const session = await getSession({ req });
  if (!session?.user.id) return res.status(401).json({ status: 'error', message: 'Not logged in' });

  const points = await getUserPoints(session?.user?.id, req.query.gameid);

  res.status(200).json({ status: 'ok', points });
};

export default pointsHandler;

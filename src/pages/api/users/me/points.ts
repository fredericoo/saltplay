import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { Game, Season, User } from '@prisma/client';
import { NextApiHandler } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { object, string } from 'yup';
import { nextAuthOptions } from '../../auth/[...nextauth]';

const getUserPoints = async (playerid: User['id'], gameid: Game['id'], seasonid: Season['id']) => {
  const user = await prisma.playerScore.findUnique({
    where: { gameid_playerid_seasonid: { gameid, playerid, seasonid } },
    select: { points: true },
  });
  return user?.points || null;
};

export type PlayerPointsAPIResponse = APIResponse<{
  points: Awaited<ReturnType<typeof getUserPoints>>;
}>;

const querySchema = object({
  gameId: string().required(),
  seasonId: string().required(),
});

const isProd = process.env.NODE_ENV === 'production';

const pointsHandler: NextApiHandler<PlayerPointsAPIResponse> = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  querySchema
    .validate(req.query, { abortEarly: false, stripUnknown: true })
    .then(async query => {
      const session = await unstable_getServerSession(req, res, nextAuthOptions);
      if (!session?.user.id) return res.status(401).json({ status: 'error', message: 'Not logged in' });

      const points = await getUserPoints(session?.user?.id, query.gameId, query.seasonId);

      res.status(200).json({ status: 'ok', data: { points } });
    })
    .catch(err => {
      res.status(400).json({ status: 'error', message: !isProd ? err.message : 'Bad request' });
    });
};

export default pointsHandler;

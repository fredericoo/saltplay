import prisma from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { PlayerScore } from '@prisma/client';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';
import { deletePlayerScoreSchema } from '../../schemas';

export type PlayerScoreDELETEAPIResponse = APIResponse<PlayerScore>;

const deletePlayerScoreHandler: NextApiHandler<PlayerScoreDELETEAPIResponse> = async (req, res) => {
  await deletePlayerScoreSchema
    .validate(req.query, { abortEarly: false })
    .then(async query => {
      const session = await getServerSession({ req, res }, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      const playerScore = await prisma.playerScore.delete({ where: { id: query.id } });

      res.status(200).json({ status: 'ok', data: playerScore });
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ status: 'error', message: err.errors[0].message });
    });
};

export default deletePlayerScoreHandler;

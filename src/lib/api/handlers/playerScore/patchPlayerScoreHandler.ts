import prisma from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { PlayerScore } from '@prisma/client';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';
import { InferType, ValidationError } from 'yup';
import { patchPlayerScoreSchema } from '../../schemas';

type PatchPlayerScoreSchema = InferType<typeof patchPlayerScoreSchema>;
export type ValidPlayerScoreResponse = Awaited<ReturnType<typeof updatePlayerScore>>;
export type PlayerScorePATCHAPIResponse = APIResponse<ValidPlayerScoreResponse>;

const updatePlayerScore = async (id: PlayerScore['id'], { gameId, ...body }: PatchPlayerScoreSchema) => {
  const data = gameId ? { ...body, game: { connect: { id: gameId } } } : body;
  return await prisma.playerScore.update({
    where: { id },
    data,
    include: {
      game: { select: { name: true, icon: true, id: true } },
    },
  });
};

const patchPlayerScoreHandler: NextApiHandler<PlayerScorePATCHAPIResponse> = async (req, res) => {
  await patchPlayerScoreSchema
    .validate(req.body, { abortEarly: true })
    .then(async body => {
      const session = await getServerSession({ req, res }, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      const id = req.query.id;

      if (typeof id !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid playerScore id' });
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      const game = await updatePlayerScore(id, body);
      res.status(200).json({ status: 'ok', data: game });
    })
    .catch((err: ValidationError) => {
      console.error(err);
      const stack = err.inner.map(err => ({
        type: err.type,
        path: err.path as keyof ValidPlayerScoreResponse,
        message: err.errors.join('; '),
      }));
      return res.status(400).json({ status: 'error', stack });
    });
};

export default patchPlayerScoreHandler;

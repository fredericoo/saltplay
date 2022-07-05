import { patchGameSchema } from '@/lib/api/schemas';
import prisma, { getErrorStack } from '@/lib/prisma';
import revalidateStaticPages from '@/lib/revalidateStaticPages';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { Game } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { withSentry } from '@sentry/nextjs';
import { NextApiHandler } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { InferType, ValidationError } from 'yup';

type PatchGameBody = InferType<typeof patchGameSchema>;
export type ValidGamePatchResponse = Awaited<ReturnType<typeof updateGame>>;
export type GamePATCHAPIResponse = APIResponse<ValidGamePatchResponse>;

const updateGame = async (gameId: Game['id'], body: PatchGameBody) =>
  await prisma.game.update({
    where: { id: gameId },
    data: body,
    include: {
      office: true,
    },
  });

const patchGameHandler: NextApiHandler<GamePATCHAPIResponse> = async (req, res) => {
  await patchGameSchema
    .validate(req.body, { abortEarly: true, stripUnknown: true })
    .then(async body => {
      const session = await unstable_getServerSession(req, res, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      const gameId = req.query.id;

      if (typeof gameId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid game id' });
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      return await updateGame(gameId, body)
        .then(async game => {
          await revalidateStaticPages(['/', `/${game.office.slug}`, `/${game.office.slug}/${game.slug}`], res);
          res.status(200).json({ status: 'ok', data: game });
        })
        .catch((error: PrismaClientKnownRequestError) => {
          const stack = getErrorStack(error);
          return res.status(400).json({ status: 'error', stack });
        });
    })
    .catch((err: ValidationError) => {
      console.error(err);
      const stack = err.inner.map(err => ({
        type: err.type,
        path: err.path as keyof ValidGamePatchResponse,
        message: err.errors.join('; '),
      }));
      return res.status(400).json({ status: 'error', stack });
    });
};

export default withSentry(patchGameHandler);

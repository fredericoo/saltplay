import { patchSeasonSchema } from '@/lib/api/schemas';
import prisma, { getErrorStack } from '@/lib/prisma';
import revalidateStaticPages from '@/lib/revalidateStaticPages';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { Season } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextApiHandler } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { InferType, ValidationError } from 'yup';

type PatchSeasonBody = InferType<typeof patchSeasonSchema>;
export type ValidGamePatchResponse = Awaited<ReturnType<typeof updateSeason>>;
export type GamePATCHAPIResponse = APIResponse<ValidGamePatchResponse>;

const updateSeason = async (seasonId: Season['id'], { startDate, ...body }: PatchSeasonBody) =>
  await prisma.season.update({
    where: { id: seasonId },
    data: {
      startDate: startDate ? new Date(startDate) : undefined,
      ...body,
    },
    select: {
      name: true,
      startDate: true,
      slug: true,
      game: { select: { slug: true, office: { select: { slug: true } } } },
    },
  });

const patchSeasonHandler: NextApiHandler<GamePATCHAPIResponse> = async (req, res) => {
  await patchSeasonSchema
    .validate(req.body, { abortEarly: true, stripUnknown: true })
    .then(async body => {
      const session = await unstable_getServerSession(req, res, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      const seasonId = req.query.id;

      if (typeof seasonId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid season id' });
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      return await updateSeason(seasonId, body)
        .then(async season => {
          await revalidateStaticPages(
            [
              '/',
              `/${season.game.office.slug}`,
              `/${season.game.office.slug}/${season.game.slug}`,
              `/${season.game.office.slug}/${season.game.slug}/${season.slug}`,
            ],
            res
          );
          res.status(200).json({ status: 'ok', data: season });
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

export default patchSeasonHandler;

import { postSeasonSchema } from '@/lib/api/schemas';
import prisma from '@/lib/prisma';
import revalidateStaticPages from '@/lib/revalidateStaticPages';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { NextApiHandler } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { InferType, ValidationError } from 'yup';

type PostSeasonBody = InferType<typeof postSeasonSchema>;
export type ValidSeasonPostResponse = Awaited<ReturnType<typeof createSeason>>;
export type SeasonPOSTAPIResponse = APIResponse<ValidSeasonPostResponse>;

const createSeason = async ({ gameid, startDate, ...body }: PostSeasonBody) =>
  await prisma.season.create({
    data: {
      ...body,
      startDate: new Date(startDate),
      game: { connect: { id: gameid } },
    },
    select: {
      slug: true,
      game: { select: { slug: true, office: { select: { slug: true } } } },
    },
  });

const postSeasonHandler: NextApiHandler<SeasonPOSTAPIResponse> = async (req, res) => {
  await postSeasonSchema
    .validate(req.body, { abortEarly: true, stripUnknown: true })
    .then(async body => {
      const session = await unstable_getServerSession(req, res, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);

      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      try {
        const season = await createSeason(body);
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
      } catch (e) {
        console.error(e);
        if (e instanceof PrismaClientValidationError) {
          return res.status(400).json({ status: 'error', message: e.name });
        }
      }
    })
    .catch((err: ValidationError) => {
      console.error(err);
      const stack = err.inner.map(err => ({
        type: err.type,
        path: err.path as keyof ValidSeasonPostResponse,
        message: err.errors.join('; '),
      }));
      return res.status(400).json({ status: 'error', stack });
    });
};

export default postSeasonHandler;

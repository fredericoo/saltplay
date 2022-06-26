import prisma from '@/lib/prisma';
import revalidateStaticPages from '@/lib/revalidateStaticPages';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { Season } from '@prisma/client';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';
import { object, string } from 'yup';

export type SeasonDELETEAPIResponse = APIResponse<Season>;

const requestSchema = object().shape({
  id: string(),
});

const deleteSeasonHandler: NextApiHandler<SeasonDELETEAPIResponse> = async (req, res) => {
  await requestSchema
    .validate(req.query, { abortEarly: false, stripUnknown: true })
    .then(async query => {
      const session = await getServerSession({ req, res }, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      const transaction = await prisma.$transaction([
        prisma.match.deleteMany({ where: { seasonid: query.id } }),
        prisma.playerScore.deleteMany({ where: { seasonid: query.id } }),
        prisma.season.delete({
          where: { id: query.id },
          select: {
            id: true,
            gameid: true,
            active: true,
            startDate: true,
            name: true,
            slug: true,
            icon: true,
            game: { select: { slug: true, office: { select: { slug: true } } } },
          },
        }),
      ]);
      const season = transaction[2];

      await revalidateStaticPages(
        ['/', `/${season.game.office.slug}`, `/${season.game.office.slug}/${season.game.slug}`],
        res
      );
      res.status(200).json({ status: 'ok', data: season });
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ status: 'error', message: err.errors[0].message });
    });
};

export default deleteSeasonHandler;

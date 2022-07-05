import prisma from '@/lib/prisma';
import revalidateStaticPages from '@/lib/revalidateStaticPages';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { Office } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
import { NextApiHandler } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { object, string } from 'yup';

export type OfficeDELETEAPIResponse = APIResponse<Office>;

const requestSchema = object().shape({
  id: string(),
});

const deleteOfficeHandler: NextApiHandler<OfficeDELETEAPIResponse> = async (req, res) => {
  await requestSchema
    .validate(req.query, { abortEarly: false, stripUnknown: true })
    .then(async query => {
      const session = await unstable_getServerSession(req, res, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      const gameIds = await prisma.office
        .findUnique({ where: { id: query.id }, select: { games: { select: { id: true } } } })
        .then(office => office?.games.map(game => game.id) || []);

      const transaction = await prisma.$transaction([
        prisma.match.deleteMany({ where: { gameid: { in: gameIds } } }),
        prisma.playerScore.deleteMany({ where: { gameid: { in: gameIds } } }),
        prisma.game.deleteMany({ where: { officeid: query.id } }),
        prisma.office.delete({
          where: { id: query.id },
        }),
      ]);
      const office = transaction[3];

      await revalidateStaticPages(['/', `/${office.slug}`], res);
      res.status(200).json({ status: 'ok', data: office });
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ status: 'error', message: err.errors[0].message });
    });
};

export default withSentry(deleteOfficeHandler);

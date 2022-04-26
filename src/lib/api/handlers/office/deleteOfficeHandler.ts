import prisma from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { Office } from '@prisma/client';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';
import { object, string } from 'yup';

export type OfficeDELETEAPIResponse = APIResponse<Office>;

const requestSchema = object().shape({
  id: string(),
});

const deleteOfficeHandler: NextApiHandler<OfficeDELETEAPIResponse> = async (req, res) => {
  await requestSchema
    .validate(req.query, { abortEarly: false })
    .then(async query => {
      const session = await getServerSession({ req, res }, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      const gameIds = await prisma.office
        .findUnique({ where: { id: query.id }, select: { games: { select: { id: true } } } })
        .then(office => office?.games.map(game => game.id) || []);

      const [_, __, ___, office] = await prisma.$transaction([
        prisma.match.deleteMany({ where: { gameid: { in: gameIds } } }),
        prisma.playerScore.deleteMany({ where: { gameid: { in: gameIds } } }),
        prisma.game.deleteMany({ where: { officeid: query.id } }),
        prisma.office.delete({
          where: { id: query.id },
        }),
      ]);

      res.status(200).json({ status: 'ok', data: office });
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ status: 'error', message: err.errors[0].message });
    });
};

export default deleteOfficeHandler;

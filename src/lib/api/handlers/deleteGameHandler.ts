import prisma from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { Office } from '@prisma/client';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';
import { object, string } from 'yup';

export type GameDELETEAPIResponse = APIResponse<{ data: Office }>;

const requestSchema = object().shape({
  id: string(),
});

const deleteGameHandler: NextApiHandler<GameDELETEAPIResponse> = async (req, res) => {
  await requestSchema
    .validate(req.query, { abortEarly: false })
    .then(async query => {
      const session = await getServerSession({ req, res }, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      const [_, __, game] = await prisma.$transaction([
        prisma.match.deleteMany({ where: { gameid: query.id } }),
        prisma.playerScore.deleteMany({ where: { gameid: query.id } }),
        prisma.game.delete({ where: { id: query.id }, include: { office: true } }),
      ]);

      try {
        await res.unstable_revalidate(`/`);
        await res.unstable_revalidate(`/${game.office.slug}`);
        await res.unstable_revalidate(`/${game.office.slug}/${game.slug}`);
      } catch {
        console.warn('Failed to revalidate');
      }
      res.status(200).json({ status: 'ok', data: game });
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ status: 'error', message: err.errors[0].message });
    });
};

export default deleteGameHandler;
import prisma from '@/lib/prisma';
import revalidateStaticPages from '@/lib/revalidateStaticPages';
import { canViewDashboard } from '@/lib/roles';
import type { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import type { Game } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
import type { NextApiHandler } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { object, string } from 'yup';

export type GameDELETEAPIResponse = APIResponse<Game>;

const requestSchema = object().shape({
  id: string(),
});

const deleteGameHandler: NextApiHandler<GameDELETEAPIResponse> = async (req, res) => {
  await requestSchema
    .validate(req.query, { abortEarly: false, stripUnknown: true })
    .then(async query => {
      const session = await unstable_getServerSession(req, res, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      const transaction = await prisma.$transaction([
        prisma.match.deleteMany({ where: { gameid: query.id } }),
        prisma.playerScore.deleteMany({ where: { gameid: query.id } }),
        prisma.game.delete({ where: { id: query.id }, include: { office: true } }),
      ]);
      const game = transaction[2];

      await revalidateStaticPages(['/', `/${game.office.slug}`, `/${game.office.slug}/${game.slug}`], res);
      res.status(200).json({ status: 'ok', data: game });
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ status: 'error', message: err.errors[0].message });
    });
};

export default withSentry(deleteGameHandler);

import { flagsSchema } from '@/lib/flagAttributes';
import prisma from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import { slugSchema } from '@/lib/slug';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { Game } from '@prisma/client';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';
import { number, object, string } from 'yup';

export type GamePATCHAPIResponse = APIResponse<{ data: Game }>;

const editableFieldsSchema = object({
  name: string(),
  icon: string(),
  slug: slugSchema,
  flags: flagsSchema,
  maxPlayersPerTeam: number().max(10),
});

const patchGameHandler: NextApiHandler<GamePATCHAPIResponse> = async (req, res) => {
  await editableFieldsSchema
    .validate(req.body, { abortEarly: false })
    .then(async body => {
      const session = await getServerSession({ req, res }, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      const gameId = req.query.id;

      if (typeof gameId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid game id' });
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      try {
        const game = await prisma.game.update({
          where: { id: gameId },
          data: body,
          include: {
            office: true,
          },
        });
        res.status(200).json({ status: 'ok', data: game });
      } catch (e) {
        console.error(e);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ status: 'error', message: err.errors[0].message });
    });
};

export default patchGameHandler;

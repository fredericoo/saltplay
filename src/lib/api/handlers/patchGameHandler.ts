import { GAME_FLAGS } from '@/constants';
import prisma from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import { validateSlug } from '@/lib/slug';
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
  slug: string().test(
    'is-slug',
    d => `${d.value} does not match a slug format`,
    slug => typeof slug === 'undefined' || validateSlug(slug)
  ),
  flags: number()
    .min(0)
    .max(Object.values(GAME_FLAGS).reduce((acc, cur) => acc + cur)),
  maxPlayersPerTeam: number(),
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
        try {
          res.unstable_revalidate(`/${game.office.slug}/${game.slug}`);
          res.unstable_revalidate(`/${game.office.slug}`);
          res.unstable_revalidate(`/`);
        } catch {
          console.warn('Failed to revalidate');
        }
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

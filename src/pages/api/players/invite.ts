import { NextApiHandler } from 'next';
import { PromiseElement } from '@/lib/types/utils';
import { APIResponse } from '@/lib/types/api';
import slack from '@/lib/slackbot/client';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

const getSlackUsers = async () => {
  const slackUsers = await slack.users.list();
  const existingUsers = await prisma.user.findMany({
    select: { accounts: { where: { provider: 'slack' }, select: { providerAccountId: true } } },
  });
  return slackUsers?.members
    ?.filter(user => !user.is_bot && !user.is_restricted && !user.is_ultra_restricted && !user.deleted)
    .filter(
      user =>
        user.profile?.first_name &&
        !existingUsers?.find(
          existingUser => !!existingUser?.accounts?.find(account => account?.providerAccountId === user.id)
        )
    )
    .map(user => ({
      name: [user.profile?.first_name, user.profile?.last_name].join(' ') || user.profile?.display_name || null,
      id: user.id || 'undefined',
      image: user.profile?.image_192 || null,
      source: 'slack',
      roleId: 2,
    }));
};

export type InvitePlayersAPIResponse = APIResponse<{
  users: PromiseElement<ReturnType<typeof getSlackUsers>>;
}>;

const invitedUsersHandler: NextApiHandler<InvitePlayersAPIResponse> = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });

  const session = await getSession({ req });
  if (!session) return res.status(403).json({ status: 'error', message: 'Not logged in' });

  const users = await getSlackUsers();

  process.env.NODE_ENV === 'production' &&
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600');
  res.status(200).json({ status: 'ok', users });
};

export default invitedUsersHandler;

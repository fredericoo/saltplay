import { NextApiHandler } from 'next';
import { PromiseElement } from '@/lib/types/utils';
import { APIResponse } from '@/lib/types/api';
import slack from '@/lib/slackbot/client';

const getUsers = async () => {
  const slackUsers = await slack.users.list();
  return slackUsers?.members
    ?.filter(user => {
      return !user.is_bot && !user.is_restricted && !user.is_ultra_restricted;
    })
    .map(user => ({
      name: [user.profile?.first_name, user.profile?.last_name].join(' ') || null,
      id: user.id || 'undefined',
      image: user.profile?.image_192 || null,
    }));
};

export type NonRegisteredUsersAPIResponse = APIResponse<{
  users: PromiseElement<ReturnType<typeof getUsers>>;
}>;

const nonRegisteredUsersHandler: NextApiHandler<NonRegisteredUsersAPIResponse> = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });

  const users = await getUsers();

  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400');
  res.status(200).json({ status: 'ok', users });
};

export default nonRegisteredUsersHandler;

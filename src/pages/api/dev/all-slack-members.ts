import { Player } from '@/components/PlayerPicker/types';
import slack from '@/lib/slackbot/client';
import { APIResponse } from '@/lib/types/api';
import { Member } from '@slack/web-api/dist/response/UsersListResponse';
import { NextApiHandler } from 'next';

const getAllSlackMembers = async () => {
  const getSlackMembers = async (members: Member[], cursor?: string): Promise<Member[]> => {
    const query = await slack.users.list({ limit: 500, cursor });
    if (!query.members) return members;
    if (query.response_metadata?.next_cursor) {
      return getSlackMembers(members.concat(query.members), query.response_metadata.next_cursor);
    }
    return members.concat(query.members);
  };

  return await getSlackMembers([]);
};

export type AllSlackMembersAPIResponse = APIResponse<{
  members: Player[];
}>;

const allSlackMembersHandle: NextApiHandler<AllSlackMembersAPIResponse> = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });

  const allMembers = await getAllSlackMembers();

  const members = allMembers
    ?.filter(user => !user.is_bot && !user.is_restricted && !user.is_ultra_restricted && !user.deleted)
    .filter(user => user.profile?.real_name || user.profile?.display_name)
    .map(user => ({
      name: user.profile?.real_name || user.profile?.display_name || null,
      id: user.id || 'undefined',
      image: user.profile?.image_192 || null,
      source: 'slack',
      roleId: 2,
    }));

  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400');
  res.status(200).json({ status: 'ok', members });
};

export default allSlackMembersHandle;

import slack from '@/lib/slack/client';
import type { Member } from '@slack/web-api/dist/response/UsersListResponse';

const getAllSlackMembers = async () => {
  const getSlackMembers = async (members: Member[], cursor?: string): Promise<Member[]> => {
    const query = await slack.users.list({ limit: 500, cursor });
    if (!query.members) return members;
    if (query.response_metadata?.next_cursor) {
      return getSlackMembers(members.concat(query.members), query.response_metadata.next_cursor);
    }
    return members.concat(query.members);
  };

  const allSlackMembers = await getSlackMembers([]);
  return allSlackMembers
    .filter(user => !user.is_bot && !user.is_restricted && !user.is_ultra_restricted && !user.deleted)
    .filter(user => user.profile?.real_name || user.profile?.display_name)
    .map(user => ({
      name: user.profile?.real_name || user.profile?.display_name || null,
      id: user.id || 'undefined',
      image: user.profile?.image_192 || null,
      source: 'slack',
      roleId: 2,
    }));
};

export default getAllSlackMembers;

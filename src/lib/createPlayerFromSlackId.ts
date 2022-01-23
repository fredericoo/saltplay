import prisma from '@/lib/prisma';
import slack from './slackbot/client';

const createPlayerFromSlackId = async (slackId: string) => {
  const slackPlayerInfo = await slack.users.profile.get({ user: slackId });
  if (!slackPlayerInfo) throw new Error('Failed to get slack user info');
  return await prisma.user
    .create({
      data: {
        name: slackPlayerInfo.profile?.real_name,
        email: slackPlayerInfo.profile?.email,
        image: slackPlayerInfo.profile?.image_192,
        accounts: { create: [{ type: 'anonymous', provider: 'slack', providerAccountId: slackId }] },
      },
      select: { id: true },
    })
    .then(({ id }) => id);
};

export default createPlayerFromSlackId;

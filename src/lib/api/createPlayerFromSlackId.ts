import prisma from '@/lib/prisma';
import slack from '../slackbot/client';

/**
 * Creates a new user in the database and returns its ID. If the user already exists, returns its ID.
 * @param slackId A slack user ID.
 * @returns the created or existing user ID.
 */
const createPlayerFromSlackId = async (slackId: string) => {
  const alreadyExists = await prisma.user.findFirst({
    select: { id: true },
    where: { accounts: { some: { provider: 'slack', providerAccountId: slackId } } },
  });
  if (alreadyExists) return alreadyExists.id;

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

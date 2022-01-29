import prisma from '@/lib/prisma';
import { GUEST_ROLE_ID } from '../constants';
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
  const newUser = await prisma.user
    .create({
      data: {
        name: slackPlayerInfo.profile?.real_name,
        email: slackPlayerInfo.profile?.email,
        image: slackPlayerInfo.profile?.image_192,
        roleId: GUEST_ROLE_ID,
        accounts: { create: [{ type: 'guest', provider: 'slack', providerAccountId: slackId }] },
      },
      select: { id: true },
    })
    .then(({ id }) => id);

  slack.chat.postMessage({
    channel: slackId,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: "Heads up!\nYou've been invited to SaltPlay.\nGo to https://saltplay.app to view the latest matches or join #saltplay-matches to keep track of who’s taking ownership of the games room.",
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'View all matches',
            },
            style: 'primary',
            url: 'https://saltplay.app',
          },
        ],
      },
    ],
  });

  return newUser;
};

export default createPlayerFromSlackId;

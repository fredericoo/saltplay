import { USER_ROLE_ID } from '@/lib/constants';
import prisma from '@/lib/prisma';
import { Account, User } from 'next-auth/core/types';
import slack from '../slackbot/client';

const turnGuestToUser = async (user: User, account: Account) => {
  const provider_providerAccountId = { provider: account.provider, providerAccountId: account.providerAccountId };
  const { type, token_type, id_token, access_token } = account;
  try {
    await prisma.account.update({
      where: { provider_providerAccountId: provider_providerAccountId },
      data: { type, token_type, id_token, access_token },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { roleId: USER_ROLE_ID },
    });

    const channel = process.env.SLACK_MATCH_NOTIFICATION_CHANNEL;
    if (channel) {
      await slack.channels.invite({ channel, user: account.providerAccountId });
      const mention = account.providerAccountId ? `<@${account.providerAccountId}>` : user.name;

      await slack.chat.postMessage({
        channel,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `:alert: *A new challenger has appeared!*\n${mention} has joined SaltPlay.`,
            },
            accessory: {
              type: 'image',
              image_url: user.image || '',
              alt_text: user.name || 'Avatar of user',
            },
          },
        ],
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default turnGuestToUser;

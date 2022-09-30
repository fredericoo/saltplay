import type { Account, User } from '@prisma/client';
import slack from './client';

type NotifyNewcomer = (
  options: Pick<Account, 'providerAccountId'> & Partial<Pick<User, 'name' | 'image'>>
) => Promise<boolean>;

const notifyNewcomer: NotifyNewcomer = async ({ providerAccountId, name, image }) => {
  const channel = process.env.SLACK_MATCH_NOTIFICATION_CHANNEL;
  if (!channel) return true;

  try {
    await slack.conversations.invite({ channel, users: providerAccountId });
  } catch {}
  const mention = providerAccountId ? `<@${providerAccountId}>` : name;

  try {
    await slack.chat.postMessage({
      channel,
      text: `:alert: *A new challenger has appeared!*\n${mention} has joined wrkplay.`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:alert: *A new challenger has appeared!*\n${mention} has joined wrkplay.`,
          },
          accessory: {
            type: 'image',
            image_url: image || '',
            alt_text: name || 'Avatar of user',
          },
        },
      ],
    });
    return true;
  } catch {
    return false;
  }
};

export default notifyNewcomer;

import prisma from '@/lib/prisma';
import { Game, User } from '@prisma/client';
import { ChatPostMessageResponse } from '@slack/web-api';
import { getGameFlags } from '../flagAttributes';
import slack from './client';

const CHANNEL = process.env.SLACK_MATCH_NOTIFICATION_CHANNEL || 'C02TBGT7ME3';

type NotifyOptions = {
  gameId: Game['id'];
  leftScore: number;
  rightScore: number;
  left: Pick<User, 'id'>[];
  right: Pick<User, 'id'>[];
};

const getPlayerMentionName = async (id: User['id']) => {
  const player = await prisma.user.findUnique({
    where: { id },
    select: { name: true, accounts: { where: { provider: 'slack' }, select: { providerAccountId: true } } },
  });
  if (!player) return 'Anonymous';

  const slackId = player.accounts?.[0]?.providerAccountId;
  if (slackId) return `<@${slackId}>`;
  return player.name;
};

export const notifyMatchOnSlack = async ({
  gameId,
  leftScore,
  rightScore,
  left,
  right,
}: NotifyOptions): Promise<ChatPostMessageResponse | undefined> => {
  if (process.env.ENABLE_SLACK_MATCH_NOTIFICATION !== 'true') return;

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: {
      name: true,
      icon: true,
      flags: true,
      office: {
        select: {
          name: true,
        },
      },
    },
  });

  const flags = getGameFlags(game?.flags);
  const getWinnerIcon = (loserScore: number, winnerScore: number) => {
    if (loserScore === 0 && winnerScore > 4 && flags.babyBottleIfHumiliated) return '🍼';
    return '🏆';
  };

  const leftNames = await Promise.all(left.map(async player => await getPlayerMentionName(player.id)));
  const rightNames = await Promise.all(right.map(async player => await getPlayerMentionName(player.id)));

  const text = `>${leftNames.join(', ')} ${
    leftScore > rightScore ? getWinnerIcon(rightScore, leftScore) : ''
  }*${leftScore}* ✕ *${rightScore}* ${
    rightScore > leftScore ? getWinnerIcon(leftScore, rightScore) : ''
  }${rightNames.join(', ')}\n>_${game?.icon} ${game?.name} at the ${game?.office.name} office_`;

  try {
    const message = await slack.chat.postMessage({
      channel: CHANNEL,
      mrkdwn: true,
      text,
    });
    return message;
  } catch {
    return;
  }
};

type NotifyDeleteOptions = {
  timestamp: string;
  triggeredBy: string;
};

export const notifyDeletedMatch = async ({
  timestamp,
  triggeredBy,
}: NotifyDeleteOptions): Promise<string | undefined> => {
  if (process.env.ENABLE_SLACK_MATCH_NOTIFICATION !== 'true') return;

  const current = await slack.conversations.history({
    channel: CHANNEL,
    latest: timestamp,
    limit: 1,
    inclusive: true,
  });

  const message = current?.messages?.[0];

  if (!message) throw new Error('No message found');

  const lines = message.text?.split('\n');
  const strikedLines = lines?.map(line => line.replaceAll('&gt;', '&gt;~') + '~').join('\n');
  const text = strikedLines + `\n❌ This match has been deleted by ${triggeredBy}`;

  const edit = await slack.chat.update({ as_user: true, channel: CHANNEL, ts: timestamp, text });

  return edit.message?.edited?.ts;
};

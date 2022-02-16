import prisma from '@/lib/prisma';
import { Game, User } from '@prisma/client';
import { getGameFlags } from '../flagAttributes';
import slack from './client';

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
}: NotifyOptions): Promise<boolean> => {
  if (process.env.ENABLE_SLACK_MATCH_NOTIFICATION !== 'true') return true;

  const channel = process.env.SLACK_MATCH_NOTIFICATION_CHANNEL || 'C02TBGT7ME3';

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
  const getWinnerIcon = (loserScore: number) => {
    if (loserScore === 0 && flags.babyBottleIfHumiliated) return '🍼';
    return '🏆';
  };

  const leftNames = await Promise.all(left.map(async player => await getPlayerMentionName(player.id)));
  const rightNames = await Promise.all(right.map(async player => await getPlayerMentionName(player.id)));

  const text = `>${leftNames.join(', ')} ${
    leftScore > rightScore ? getWinnerIcon(rightScore) : ''
  }*${leftScore}* ✕ *${rightScore}* ${rightScore > leftScore ? getWinnerIcon(leftScore) : ''}${rightNames.join(
    ', '
  )}\n>_${game?.icon} ${game?.name} at the ${game?.office.name} office_`;

  try {
    await slack.chat.postMessage({
      channel,
      mrkdwn: true,
      text,
    });
    return true;
  } catch {
    return false;
  }
};

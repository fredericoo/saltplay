import { Game, User } from '@prisma/client';
import prisma from '@/lib/prisma';
import slack from './client';

type PlayerStat = {
  id: User['id'];
  score: number;
};
type NotifyOptions = {
  gameId: Game['id'];
  p1: PlayerStat;
  p2: PlayerStat;
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

export const notifyMatchOnSlack = async ({ gameId, p1, p2 }: NotifyOptions) => {
  const channel = process.env.SLACK_MATCH_NOTIFICATION_CHANNEL || 'C02TBGT7ME3';

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: {
      name: true,
      icon: true,
      office: {
        select: {
          name: true,
        },
      },
    },
  });

  const p1Name = await getPlayerMentionName(p1.id);
  const p2Name = await getPlayerMentionName(p2.id);

  const text = `${p1Name} ${p1.score > p2.score ? '🏆 ' : ''}*${p1.score}* ✕ *${p2.score}* ${
    p2.score > p1.score ? '🏆 ' : ''
  }${p2Name}\n_${game?.icon} ${game?.name} at the ${game?.office.name} office_`;

  return await slack.chat.postMessage({
    channel,
    mrkdwn: true,
    text,
  });
};

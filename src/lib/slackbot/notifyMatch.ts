import { Game } from '@prisma/client';
import prisma from '@/lib/prisma';
import slack from './client';

type PlayerStat = {
  slack: string;
  score: number;
};
type NotifyOptions = {
  gameId: Game['id'];
  p1: PlayerStat;
  p2: PlayerStat;
};

export const notifyMatchOnSlack = async ({ gameId, p1, p2 }: NotifyOptions) => {
  const channel = process.env.SLACK_MATCH_NOTIFICATION_CHANNEL || 'C02T1934MV4';

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

  const text = `<@${p1.slack}> ${p1.score > p2.score ? '🏆 ' : ''}*${p1.score}* ✕ *${p2.score}* ${
    p2.score > p1.score ? '🏆 ' : ''
  }<@${p2.slack}>\n_${game?.icon} ${game?.name} at the ${game?.office.name} office_`;

  return await slack.chat.postMessage({
    channel,
    mrkdwn: true,
    text,
  });
};

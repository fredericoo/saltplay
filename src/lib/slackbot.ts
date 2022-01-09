import { WebClient } from '@slack/web-api';
import prisma from '@/lib/prisma';
import { Game, Office } from '@prisma/client';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
const channel = 'C02T1934MV4';

const sendSlackMessage = async (text: string) => {
  const res = await slack.chat.postMessage({
    channel,
    mrkdwn: true,
    text,
  });
  return res;
};

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

  sendSlackMessage(
    `<@${p1.slack}> ${p1.score > p2.score ? '🏆 ' : ''}*${p1.score}* ✕ *${p2.score}* ${
      p2.score > p1.score ? '🏆 ' : ''
    }<@${p2.slack}>\n_${game?.icon} ${game?.name} at the ${game?.office.name} office_`
  );
};

export default sendSlackMessage;

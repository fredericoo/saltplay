import { STARTING_POINTS } from '@/constants';
import prisma from '@/lib/prisma';
import { notifyDeletedMatch } from '@/lib/slackbot/notifyMatch';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';
import { InferType, object, string } from 'yup';

export type DeleteMatchesOptions = InferType<typeof querySchema>;
export type MatchesDELETEAPIResponse = APIResponse;

const querySchema = object({
  matchId: string().required(),
});

const isProd = process.env.NODE_ENV === 'production';
const deleteMatchesHandler: NextApiHandler<MatchesDELETEAPIResponse> = async (req, res) => {
  const session = await getServerSession({ req, res }, nextAuthOptions);
  if (!session) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

  querySchema
    .validate(req.query, { abortEarly: false })
    .then(async ({ matchId }) => {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        select: {
          id: true,
          left: { select: { id: true } },
          right: { select: { id: true } },
          gameid: true,
          leftscore: true,
          rightscore: true,
          points: true,
          createdAt: true,
          notification_id: true,
        },
      });

      if (!match) return res.status(404).json({ status: 'error', message: 'Match not found' });

      if (![...match.left, ...match.right].find(player => player.id === session.user.id))
        return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      const matchPlayers = [
        ...match.left.map(player => ({ ...player, multiplier: match.leftscore > match.rightscore ? 1 : -1 })),
        ...match.right.map(player => ({ ...player, multiplier: match.leftscore < match.rightscore ? 1 : -1 })),
      ];
      await Promise.all(
        matchPlayers.map(async player => {
          const playerScore = await prisma.playerScore.upsert({
            where: {
              gameid_playerid: {
                gameid: match.gameid,
                playerid: player.id,
              },
            },
            update: {
              points: {
                decrement: match.points * player.multiplier,
              },
            },
            create: {
              points: STARTING_POINTS,
              gameid: match.gameid,
              playerid: player.id,
            },
            select: {
              player: {
                select: {
                  leftmatches: { where: { id: { not: match.id }, gameid: match.gameid }, select: { id: true } },
                  rightmatches: { where: { id: { not: match.id }, gameid: match.gameid }, select: { id: true } },
                },
              },
            },
          });
          if (playerScore.player.leftmatches.length + playerScore.player.rightmatches.length === 0) {
            await prisma.playerScore.delete({
              where: {
                gameid_playerid: {
                  gameid: match.gameid,
                  playerid: player.id,
                },
              },
            });
          }
        })
      );

      await prisma.match.delete({
        where: { id: matchId },
      });

      const timestamp = match.notification_id;
      if (timestamp)
        try {
          await notifyDeletedMatch({ timestamp, triggeredBy: session.user.name || 'Anonymous' });
        } catch (e) {
          console.error(e);
        }

      res.status(200).json({ status: 'ok' });
    })
    .catch(err => {
      res.status(400).json({ status: 'error', message: !isProd ? err.message : 'Bad request' });
    });
};

export default deleteMatchesHandler;

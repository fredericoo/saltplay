import { STARTING_POINTS } from '@/constants';
import canDeleteMatch from '@/lib/canDeleteMatch';
import { getPlayerPointsToMove, getPointsToMove } from '@/lib/points';
import prisma from '@/lib/prisma';
import { notifyDeletedMatch } from '@/lib/slack/notifyMatch';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';
import { InferType, object, string } from 'yup';

export type DeleteMatchesOptions = InferType<typeof querySchema>;
export type MatchesDELETEAPIResponse = APIResponse;

const querySchema = object({
  matchId: string().required(),
  seasonId: string().required(),
});

const isProd = process.env.NODE_ENV === 'production';
const deleteMatchesHandler: NextApiHandler<MatchesDELETEAPIResponse> = async (req, res) => {
  const session = await getServerSession({ req, res }, nextAuthOptions);
  if (!session) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

  querySchema
    .validate(req.query, { abortEarly: false, stripUnknown: true })
    .then(async ({ matchId, seasonId }) => {
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

      if (!canDeleteMatch({ user: session.user, players: [...match.left, ...match.right], createdAt: match.createdAt }))
        return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      const pointsToMove = getPointsToMove({
        leftLength: match.left.length,
        rightLength: match.right.length,
        matchPoints: match.points,
      });

      const matchPlayers = [
        ...match.left.map(player => ({
          ...player,
          multiplier: match.leftscore > match.rightscore ? 1 : -1,
          pointsToMove: getPlayerPointsToMove({ pointsToMove, teamLength: match.left.length }),
        })),
        ...match.right.map(player => ({
          ...player,
          multiplier: match.leftscore < match.rightscore ? 1 : -1,
          pointsToMove: getPlayerPointsToMove({ pointsToMove, teamLength: match.right.length }),
        })),
      ];

      const transaction = await prisma.$transaction([
        ...matchPlayers.map(player =>
          prisma.playerScore.upsert({
            where: {
              gameid_playerid_seasonid: {
                gameid: match.gameid,
                playerid: player.id,
                seasonid: seasonId,
              },
            },
            update: {
              points: {
                decrement: player.pointsToMove * player.multiplier,
              },
            },
            create: {
              points: STARTING_POINTS,
              seasonid: seasonId,
              gameid: match.gameid,
              playerid: player.id,
            },
            select: {
              player: {
                select: {
                  id: true,
                  leftmatches: { where: { id: { not: match.id }, gameid: match.gameid }, select: { id: true } },
                  rightmatches: { where: { id: { not: match.id }, gameid: match.gameid }, select: { id: true } },
                },
              },
            },
          })
        ),
        prisma.match.delete({
          where: { id: matchId },
        }),
      ]);

      transaction.forEach(async playerScore => {
        if ('player' in playerScore) {
          if (playerScore.player.leftmatches.length + playerScore.player.rightmatches.length === 0) {
            await prisma.playerScore.delete({
              where: {
                gameid_playerid_seasonid: {
                  gameid: match.gameid,
                  playerid: playerScore.player.id,
                  seasonid: seasonId,
                },
              },
            });
          }
        }
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

import { STARTING_POINTS } from '@/constants';
import { calculateMatchPoints } from '@/lib/leaderboard';
import prisma from '@/lib/prisma';
import { notifyMatchOnSlack } from '@/lib/slack/notifyMatch';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { NextApiHandler } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { array, InferType, number, object, string } from 'yup';
import getPlayerUserIds from '../../getPlayerUserIds';
import moveMatchPoints from '../../moveMatchPoints';

const sideSchema = object().shape({
  score: number().required(),
  players: array()
    .of(
      object().shape({
        id: string().required(),
        source: string().optional(),
      })
    )
    .required(),
});

const requestSchema = object().shape({
  seasonId: string().required(),
  left: sideSchema,
  right: sideSchema,
});

export type MatchesPOSTAPIRequest = InferType<typeof requestSchema>;
export type MatchesPOSTAPIResponse = APIResponse;

const postMatchesHandler: NextApiHandler<MatchesPOSTAPIResponse> = async (req, res) => {
  await requestSchema
    .validate(req.body, { abortEarly: false, stripUnknown: true })
    .then(async body => {
      const session = await unstable_getServerSession(req, res, nextAuthOptions);

      if (!session) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      if (session.user.roleId !== 0 && !body.left.players.find(p => p.id === session.user.id))
        return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      const season = await prisma.season.findUnique({
        where: { id: body.seasonId },
        select: { id: true, endDate: true, game: { select: { id: true, maxPlayersPerTeam: true } } },
      });

      if (!season) return res.status(404).json({ status: 'error', message: 'Season not found' });
      if (season.endDate) return res.status(403).json({ status: 'error', message: 'Season already finished' });

      const maxPlayersPerTeam = season.game.maxPlayersPerTeam || 1;

      if (body.left.players.length > maxPlayersPerTeam || body.right.players.length > maxPlayersPerTeam)
        return res
          .status(400)
          .json({ status: 'error', message: `Invalid team length. Allowed per team: ${maxPlayersPerTeam}` });

      const ids = {
        left: await getPlayerUserIds(body.left.players),
        right: await getPlayerUserIds(body.right.players),
      };

      const playersWithScores = await prisma.user.findMany({
        where: { id: { in: [...ids.left, ...ids.right] } },
        select: {
          id: true,
          scores: { where: { gameid: season.game.id, seasonid: season.id }, select: { playerid: true, points: true } },
        },
      });

      const sides = {
        left: playersWithScores.filter(p => ids.left.includes(p.id)),
        right: playersWithScores.filter(p => ids.right.includes(p.id)),
      };

      if (body.left.players.length !== sides.left.length || body.right.players.length !== sides.right.length)
        return res.status(400).json({ status: 'error', message: 'Invalid player ids' });

      const pointsAvg = {
        left: Math.ceil(
          sides.left.reduce((acc, cur) => acc + (cur.scores[0]?.points || STARTING_POINTS), 0) /
            body.left.players.length
        ),
        right: Math.ceil(
          sides.right.reduce((acc, cur) => acc + (cur.scores[0]?.points || STARTING_POINTS), 0) /
            body.right.players.length
        ),
      };

      const matchPoints = calculateMatchPoints(pointsAvg.left, pointsAvg.right, body.left.score - body.right.score);

      const createdMatch = await prisma.match.create({
        data: {
          createdAt: new Date().toISOString(),
          leftscore: body.left.score,
          rightscore: body.right.score,
          left: { connect: sides.left.map(({ id }) => ({ id })) },
          right: { connect: sides.right.map(({ id }) => ({ id })) },
          game: { connect: { id: season.game.id } },
          season: { connect: { id: season.id } },
          points: matchPoints,
        },
      });

      try {
        await moveMatchPoints({
          gameid: season.game.id,
          seasonId: season.id,
          pointsToMove: matchPoints,
          leftToRight: body.left.score < body.right.score,
          left: sides.left,
          right: sides.right,
        });
      } catch {
        await prisma.match.delete({ where: { id: createdMatch.id } });
        return res.status(500).json({ status: 'error', message: 'Error moving player points' });
      }

      await notifyMatchOnSlack({
        matchId: createdMatch.id,
        gameId: season.game.id,
        leftScore: body.left.score,
        rightScore: body.right.score,
        left: sides.left,
        right: sides.right,
      });

      return res.status(200).json({ status: 'ok' });
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ status: 'error', message: err.errors[0].message });
    });
};

export default postMatchesHandler;

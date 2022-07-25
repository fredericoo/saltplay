import { STARTING_POINTS } from '@/constants';
import { calculateMatchPoints } from '@/lib/leaderboard';
import prisma from '@/lib/prisma';
import { notifyMatchOnSlack } from '@/lib/slack/notifyMatch';
import { APIResponse } from '@/lib/types/api';
import { promiseProps } from '@/lib/utils';
import { withSentry } from '@sentry/nextjs';
import { NextApiHandler } from 'next';
import { array, InferType, number, object, string } from 'yup';
import moveMatchPoints from '../../../moveMatchPoints';
import authorise from './authorise';
import getPlayerUserIds from './getPlayerUserIds';
import getSeason from './getSeason';
import validateTeamLength from './validateTeamLength';

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

const postMatchHandler: NextApiHandler<MatchesPOSTAPIResponse> = async (req, res) => {
  await requestSchema
    .validate(req.body, { abortEarly: false, stripUnknown: true })
    .then(async body => {
      // Authorise the user to create a match
      const isAuthorised = await authorise({ req, res, players: body.left.players });
      if (!isAuthorised) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      // Make sure season exists and can have matches added to it
      const season = await getSeason(body.seasonId);
      if (!season) return res.status(404).json({ status: 'error', message: 'Season not found' });
      if (season.endDate) return res.status(403).json({ status: 'error', message: 'Season already finished' });

      // Ensure team lengths are compatible
      const maxPlayersPerTeam = season.game.maxPlayersPerTeam || 1;
      const isValidTeamLength = validateTeamLength({
        maxPlayersPerTeam,
        leftLength: body.left.players.length,
        rightLength: body.right.players.length,
      });

      if (!isValidTeamLength)
        return res
          .status(400)
          .json({ status: 'error', message: `Invalid team length. Allowed per team: ${maxPlayersPerTeam}` });

      // gets user ids or create users when necessary.
      const ids = await promiseProps({
        left: getPlayerUserIds(body.left.players),
        right: getPlayerUserIds(body.right.players),
      });

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

      // Move points; if fails, deletes match and returns 500.
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

      // Post on slack channel. Gracefully fails as it is not essential.
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

export default withSentry(postMatchHandler);

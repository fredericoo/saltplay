import { BANNED_ROLE_ID, PAGE_SIZE } from '@/constants';
import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import type { Prisma } from '@prisma/client';
import { Match } from '@prisma/client';
import { NextApiHandler } from 'next';
import { InferType, number, object, string } from 'yup';

const isProd = process.env.NODE_ENV === 'production';

const querySchema = object({
  gameId: string(),
  seasonId: string(),
  userId: string(),
  perPage: number().max(20).default(PAGE_SIZE),
  page: number().min(1).default(1),
});

export type LeaderboardGETOptions = InferType<typeof querySchema>;

type LeaderboardPlayer = Omit<
  GetLeaderboardPositionsResponse['playerScores'][number]['player'],
  'leftmatches' | 'rightmatches'
>;
export type LeaderboardGETAPIResponsePosition = {
  position: number;
  wins: number;
  losses: number;
  points: number;
} & LeaderboardPlayer;

export type LeaderboardGETAPIResponse = APIResponse<
  {
    positions: LeaderboardGETAPIResponsePosition[];
  },
  { nextPage?: number }
>;

const calculateWinsAndLosses = (
  matchesPlayedAsLeft: Pick<Match, 'leftscore' | 'rightscore'>[],
  matchesPlayedAsRight: Pick<Match, 'leftscore' | 'rightscore'>[]
) => {
  const p1Stats = matchesPlayedAsLeft.reduce(
    (acc, match) => {
      if (match.leftscore > match.rightscore) {
        acc.wins++;
      }
      if (match.leftscore < match.rightscore) {
        acc.losses++;
      }
      return acc;
    },
    { wins: 0, losses: 0 }
  );
  const p2Stats = matchesPlayedAsRight.reduce(
    (acc, match) => {
      if (match.leftscore < match.rightscore) {
        acc.wins++;
      }
      if (match.leftscore > match.rightscore) {
        acc.losses++;
      }
      return acc;
    },
    { wins: 0, losses: 0 }
  );

  return { wins: p1Stats.wins + p2Stats.wins, losses: p1Stats.losses + p2Stats.losses };
};

export const leaderboardOrderBy: Prisma.PlayerScoreFindManyArgs['orderBy'] = [
  { points: 'desc' },
  { player: { name: 'asc' } },
];

type GetLeaderboardPositionsResponse = Awaited<ReturnType<typeof getLeaderboardPositions>>;
const getLeaderboardPositions = async ({ gameId, seasonId, userId, perPage, page }: LeaderboardGETOptions) => {
  const totalCount = await prisma.playerScore.count({ where: { game: { id: gameId }, season: { id: seasonId } } });

  const playerScores = await prisma.game.findUnique({ where: { id: gameId } }).scores({
    where: { season: { id: seasonId } },
    cursor:
      !!userId && !!gameId && !!seasonId
        ? { gameid_playerid_seasonid: { gameid: gameId, playerid: userId, seasonid: seasonId } }
        : undefined,
    orderBy: leaderboardOrderBy,
    skip: perPage * (page - 1),
    take: perPage,
    select: {
      id: true,
      points: true,
      player: {
        select: {
          leftmatches: { where: { gameid: gameId, seasonid: seasonId }, select: { leftscore: true, rightscore: true } },
          rightmatches: {
            where: { gameid: gameId, seasonid: seasonId },
            select: { leftscore: true, rightscore: true },
          },
          id: true,
          name: true,
          image: true,
          roleId: true,
          boast: {
            select: {
              id: true,
              seasonid: true,
            },
          },
        },
      },
    },
  });

  return { totalCount, playerScores };
};

const getLeaderboardHandler: NextApiHandler<LeaderboardGETAPIResponse> = async (req, res) => {
  querySchema
    .validate(req.query, { abortEarly: false, stripUnknown: true })
    .then(async options => {
      const leaderboard = await getLeaderboardPositions(options);
      const positions = leaderboard.playerScores
        .filter(playerScore => playerScore.player.roleId !== BANNED_ROLE_ID)
        .map((playerScore, position) => {
          const { wins, losses } = calculateWinsAndLosses(
            playerScore.player.leftmatches,
            playerScore.player.rightmatches
          );
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { rightmatches, leftmatches, ...player } = playerScore.player;
          return {
            position: options.userId ? 0 : options.perPage * (options.page - 1) + position + 1,
            ...player,
            wins,
            losses,
            points: playerScore.points,
          };
        });
      const nextPage = leaderboard.totalCount > options.perPage * options.page ? options.page + 1 : undefined;

      res.status(200).json({ status: 'ok', data: { positions }, pageInfo: { nextPage } });
    })
    .catch(err => {
      res.status(400).json({ status: 'error', message: !isProd ? err.message : 'Bad request' });
    });
};

export default getLeaderboardHandler;

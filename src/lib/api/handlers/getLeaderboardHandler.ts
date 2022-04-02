import { Player } from '@/components/PlayerPicker/types';
import { PAGE_SIZE } from '@/constants';
import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { Match, PlayerScore } from '@prisma/client';
import { NextApiHandler } from 'next';
import { InferType, number, object, string } from 'yup';

const isProd = process.env.NODE_ENV === 'production';

const querySchema = object({
  gameId: string(),
  userId: string(),
  perPage: number().max(20).default(PAGE_SIZE),
  page: number().min(1).default(1),
});

export type LeaderboardGETOptions = InferType<typeof querySchema>;

export type LeaderboardGETAPIResponse = APIResponse<{
  positions: {
    position: number;
    id: Player['id'];
    name: Player['name'];
    image: Player['image'];
    roleId: Player['roleId'];
    points: PlayerScore['points'];
    wins: number;
    losses: number;
  }[];
  nextPage?: number;
}>;

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

const getLeaderboardPositions = async ({ gameId, userId, perPage, page }: LeaderboardGETOptions) => {
  const totalCount = await prisma.playerScore.count({ where: { game: { id: gameId } } });

  const playerScores = await prisma.game.findUnique({ where: { id: gameId } }).scores({
    cursor: !!userId && !!gameId ? { gameid_playerid: { gameid: gameId, playerid: userId } } : undefined,
    orderBy: [{ points: 'desc' }, { player: { name: 'asc' } }],
    skip: perPage * (page - 1),
    take: perPage,
    select: {
      id: true,
      points: true,
      player: {
        select: {
          leftmatches: { where: { gameid: gameId }, select: { leftscore: true, rightscore: true } },
          rightmatches: { where: { gameid: gameId }, select: { leftscore: true, rightscore: true } },
          id: true,
          name: true,
          image: true,
          roleId: true,
        },
      },
    },
  });

  return { totalCount, playerScores };
};

const getLeaderboardHandler: NextApiHandler<LeaderboardGETAPIResponse> = async (req, res) => {
  querySchema
    .validate(req.query, { abortEarly: false })
    .then(async options => {
      const leaderboard = await getLeaderboardPositions(options);
      const positions = leaderboard.playerScores.map((playerScore, position) => {
        const { wins, losses } = calculateWinsAndLosses(
          playerScore.player.leftmatches,
          playerScore.player.rightmatches
        );
        const { name, image, id, roleId } = playerScore.player;
        return {
          position: options.userId ? 0 : options.perPage * (options.page - 1) + position + 1,
          id,
          roleId,
          name,
          image,
          wins,
          losses,
          points: playerScore.points,
        };
      });
      const nextPage = leaderboard.totalCount > options.perPage * options.page ? options.page + 1 : undefined;

      res.status(200).json({ status: 'ok', positions, nextPage });
    })
    .catch(err => {
      res.status(400).json({ status: 'error', message: !isProd ? err.message : 'Bad request' });
    });
};

export default getLeaderboardHandler;

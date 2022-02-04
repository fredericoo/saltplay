import { Player } from '@/components/PlayerPicker/types';
import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { Match, PlayerScore } from '@prisma/client';
import { NextApiHandler } from 'next';

export type LeaderboardAPIResponse = APIResponse<{
  positions: {
    id: Player['id'];
    name: Player['name'];
    image: Player['image'];
    roleId: Player['roleId'];
    points: PlayerScore['points'];
    wins: number;
    losses: number;
  }[];
}>;

const calculateWinsAndLosses = (
  leftMatches: Pick<Match, 'leftscore' | 'rightscore'>[],
  rightMatches: Pick<Match, 'leftscore' | 'rightscore'>[]
) => {
  const p1Stats = leftMatches.reduce(
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
  const p2Stats = rightMatches.reduce(
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

const getLeaderboardPositions = (gameid: string) =>
  prisma.playerScore.findMany({
    where: { game: { id: gameid } },
    orderBy: [{ points: 'desc' }, { player: { name: 'asc' } }],
    select: {
      id: true,
      points: true,
      player: {
        select: {
          leftmatches: { where: { gameid }, select: { leftscore: true, rightscore: true } },
          rightmatches: { where: { gameid }, select: { leftscore: true, rightscore: true } },
          id: true,
          name: true,
          image: true,
          roleId: true,
        },
      },
    },
  });

const leaderboardHandler: NextApiHandler<LeaderboardAPIResponse> = async (req, res) => {
  const gameId = req.query.id;

  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (typeof gameId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid game id' });

  const playerScores = await getLeaderboardPositions(gameId);
  const positions = playerScores
    .map(playerScore => {
      const { wins, losses } = calculateWinsAndLosses(playerScore.player.leftmatches, playerScore.player.rightmatches);
      const { name, image, id, roleId } = playerScore.player;
      return {
        id,
        roleId,
        name,
        image,
        wins,
        losses,
        points: playerScore.points,
      };
    })
    .filter(player => player.wins + player.losses > 0);

  res.status(200).json({ status: 'ok', positions });
};

export default leaderboardHandler;

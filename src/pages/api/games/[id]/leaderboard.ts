import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { PromiseElement } from '@/lib/types/utils';
import { APIResponse } from '@/lib/types/api';

export type LeaderboardAPIResponse = APIResponse<{
  positions: PromiseElement<ReturnType<typeof getLeaderboardPositions>>;
}>;

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
        },
      },
    },
  });

const leaderboardHandler: NextApiHandler<LeaderboardAPIResponse> = async (req, res) => {
  const gameId = req.query.id;

  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (typeof gameId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid game id' });

  const positions = await getLeaderboardPositions(gameId);

  res.status(200).json({ status: 'ok', positions });
};

export default leaderboardHandler;

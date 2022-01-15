import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { User } from '@prisma/client';
import { APIResponse } from '@/lib/types/api';

const getPlayerMatches = (userId: User['id']) =>
  prisma.match.findMany({
    orderBy: { createdAt: 'desc' },
    where: { OR: [{ left: { some: { id: userId } } }, { right: { some: { id: userId } } }] },
    select: {
      left: { select: { id: true } },
      right: { select: { id: true } },
      leftscore: true,
      rightscore: true,
    },
  });

const getGamesFromPlayer = (userId: User['id']) =>
  prisma.playerScore.findMany({
    where: { playerid: userId },
    select: {
      game: {
        select: {
          name: true,
          icon: true,
        },
      },
    },
  });

export type PlayerStatsAPIResponse = APIResponse<{
  played: number;
  won: number;
  lost: number;
  tied: number;
  games: string[];
}>;

const gamesHandler: NextApiHandler<PlayerStatsAPIResponse> = async (req, res) => {
  const userId = req.query.id;

  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (typeof userId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid user id' });

  const matches = await getPlayerMatches(userId);
  const playerScores = await getGamesFromPlayer(userId);

  const played = matches.length;
  const won =
    matches.filter(match => match.left.find(player => player.id === userId) && match.leftscore > match.rightscore)
      .length +
    matches.filter(match => match.right.find(player => player.id === userId) && match.rightscore > match.leftscore)
      .length;
  const lost =
    matches.filter(match => match.left.find(player => player.id === userId) && match.rightscore > match.leftscore)
      .length +
    matches.filter(match => match.right.find(player => player.id === userId) && match.leftscore > match.rightscore)
      .length;
  const tied = played - won - lost;

  const games = Array.from(new Set(playerScores.map(score => [score.game.icon, score.game.name].join(' '))).values());

  // res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=300');
  res.status(200).json({ status: 'ok', played, won, lost, tied, games });
};

export default gamesHandler;

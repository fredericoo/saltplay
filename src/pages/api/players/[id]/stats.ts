import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { User } from '@prisma/client';
import { APIResponse } from '@/lib/types/api';

const getPlayerMatches = (userId: User['id']) =>
  prisma.match.findMany({
    orderBy: { createdAt: 'desc' },
    where: { OR: [{ p1id: userId }, { p2id: userId }] },
    select: {
      p1id: true,
      p2id: true,
      p1score: true,
      p2score: true,
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
    matches.filter(match => match.p1id === userId && match.p1score > match.p2score).length +
    matches.filter(match => match.p2id === userId && match.p2score > match.p1score).length;
  const lost =
    matches.filter(match => match.p1id === userId && match.p2score > match.p1score).length +
    matches.filter(match => match.p2id === userId && match.p1score > match.p2score).length;
  const tied = played - won - lost;

  const games = Array.from(new Set(playerScores.map(score => [score.game.icon, score.game.name].join(' '))).values());

  // res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=300');
  res.status(200).json({ status: 'ok', played, won, lost, tied, games });
};

export default gamesHandler;

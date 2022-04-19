import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { Game, User } from '@prisma/client';
import { NextApiHandler } from 'next';

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
          id: true,
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
  games: Pick<Game, 'id' | 'name'>[];
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

  const games = Array.from(
    new Set(
      playerScores.map(score => ({ id: score.game.id, name: [score.game.icon, score.game.name].join(' ') }))
    ).values()
  );

  res.status(200).json({ status: 'ok', data: { played, won, lost, tied, games } });
};

export default gamesHandler;

import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { Office } from '@prisma/client';
import { NextApiHandler } from 'next';

const getOfficePlayerCount = (officeid: Office['id']) =>
  prisma.playerScore.aggregate({
    where: { game: { officeid } },
    _count: {
      playerid: true,
    },
  });

const getMatchCountPerGame = (officeid: Office['id']) =>
  prisma.game.findMany({
    where: {
      officeid,
    },
    select: {
      name: true,
      _count: {
        select: {
          matches: true,
        },
      },
    },
  });

export type OfficeStatsAPIResponse = APIResponse<{
  matchesCount: number;
  playerCount: number;
  mostPlayedGame: string;
}>;

const officeStatsHandler: NextApiHandler<OfficeStatsAPIResponse> = async (req, res) => {
  const officeId = req.query.id;

  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (typeof officeId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid user id' });

  const matchesPerGame = await getMatchCountPerGame(officeId);

  const playerScoreCount = await getOfficePlayerCount(officeId);
  const matchesCount = matchesPerGame.reduce((acc, cur) => acc + cur._count.matches, 0);
  const mostPlayedGame =
    matchesPerGame.reduce((acc, cur) => {
      if (cur._count.matches > acc._count.matches) return cur;
      return acc;
    }, matchesPerGame[0])?.name || 'None yet';

  res.status(200).json({
    status: 'ok',
    data: { matchesCount, playerCount: playerScoreCount._count.playerid, mostPlayedGame: mostPlayedGame },
  });
};

export default officeStatsHandler;

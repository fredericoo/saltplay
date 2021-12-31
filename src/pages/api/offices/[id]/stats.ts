import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { Game, Office, User } from '@prisma/client';
import { APIResponse } from '@/lib/types/api';
import { PromiseElement } from '@/lib/types/utils';

const getOfficePlayerCount = (officeid: Office['id']) =>
  prisma.playerScore.count({
    where: {
      game: {
        officeid,
      },
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

  const matchesPerGame = await getMatchCountPerGame(+officeId);

  const playerCount = await getOfficePlayerCount(+officeId);
  const matchesCount = matchesPerGame.reduce((acc, cur) => acc + cur._count.matches, 0);
  const mostPlayedGame =
    matchesPerGame.reduce((acc, cur) => {
      if (cur._count.matches > acc._count.matches) return cur;
      return acc;
    }, matchesPerGame[0])?.name || 'None yet';

  // res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=300');
  res.status(200).json({ status: 'ok', matchesCount, playerCount, mostPlayedGame: mostPlayedGame });
};

export default officeStatsHandler;

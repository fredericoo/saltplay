import { MedalSrc } from '@/lib/medals';
import prisma from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';

import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { Medal, User } from '@prisma/client';
import { NextApiHandler } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { leaderboardOrderBy } from '../leaderboard/getLeaderboardHandler';

const medalsToCreate: Record<MedalSrc, Pick<Medal, 'name'>> = {
  'first-place': { name: 'First Place' },
  'second-place': { name: 'Second Place' },
  'third-place': { name: 'Third Place' },
  'top-10': { name: 'Top 10' },
  'most-played': { name: 'Ambassador' },
  'last-place': { name: 'Last Place' },
};

export type SeasonEndAPIResponse = APIResponse;

const endSeasonHandler: NextApiHandler<SeasonEndAPIResponse> = async (req, res) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  const canEdit = canViewDashboard(session?.user.roleId);
  if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

  const id = req.query.id;
  if (typeof id !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid season id' });

  const season = await prisma.season.findUnique({ where: { id }, select: { endDate: true } });
  if (season?.endDate) return res.status(400).json({ status: 'error', message: 'Season already ended' });

  const medals = await Promise.all(
    Object.entries(medalsToCreate).map(([medalSrc, medal]) =>
      prisma.medal.create({
        data: {
          seasonid: id,
          image: medalSrc,
          ...medal,
        },
        select: {
          id: true,
          image: true,
        },
      })
    )
  );

  const top10 = await prisma.season.findUnique({ where: { id } }).scores({
    take: 10,
    orderBy: leaderboardOrderBy,
    select: {
      playerid: true,
      seasonid: true,
    },
  });

  const noOfPlayers = await prisma.playerScore.count({ where: { seasonid: id } });
  const noOfMatches = await prisma.match.count({ where: { seasonid: id } });

  if (noOfPlayers >= 5 && noOfMatches >= 15) {
    const top10Medal = medals.find(medal => medal.image === 'top-10');
    if (top10Medal && noOfPlayers >= 20 && noOfMatches >= 40) {
      const top10Earners = top10.slice(3);
      await Promise.all(top10Earners.map(({ playerid }) => giveMedal(top10Medal.id, playerid)));
    }

    const firstPlaceMedal = medals.find(medal => medal.image === 'first-place');
    if (firstPlaceMedal) {
      const firstPlace = top10[0];
      await giveMedal(firstPlaceMedal.id, firstPlace.playerid);
    }

    const secondPlaceMedal = medals.find(medal => medal.image === 'second-place');
    if (secondPlaceMedal) {
      const secondPlace = top10[1];
      await giveMedal(secondPlaceMedal.id, secondPlace.playerid);
    }

    const thirdPlaceMedal = medals.find(medal => medal.image === 'third-place');
    if (thirdPlaceMedal) {
      const thirdPlace = top10[2];
      await giveMedal(thirdPlaceMedal.id, thirdPlace.playerid);
    }

    const lastPlaceMedal = medals.find(medal => medal.image === 'last-place');
    if (lastPlaceMedal) {
      const [lastPlace] = await prisma.season.findUnique({ where: { id } }).scores({
        take: 1,
        orderBy: [{ points: 'asc' }, { player: { name: 'desc' } }], // 🤖 TODO: revert leaderboardOrderBy
        select: {
          playerid: true,
        },
      });

      await giveMedal(lastPlaceMedal.id, lastPlace.playerid);
    }
  }

  await prisma.season.update({
    where: { id },
    data: {
      endDate: new Date(),
    },
  });

  return res.status(200).json({ status: 'ok' });
};

const giveMedal = async (medalId: Medal['id'], userId: User['id']) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      medals: {
        connect: { id: medalId },
      },
      boastId: medalId, // 🤖 TODO: only auto set if not already set
    },
  });
};

export default endSeasonHandler;

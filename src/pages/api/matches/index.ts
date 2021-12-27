import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { Match } from '@prisma/client';
import { getSession } from 'next-auth/react';

type Error = {
  status: 'error';
  message: string;
};

type Data = {
  status: 'ok';
  message?: never;
};

export type MatchesAPIResponse = Error | Data;

const calculateMatchPoints = async (data: Pick<Match, 'gameid' | 'p1id' | 'p2id' | 'p1score' | 'p2score'>) => {
  if (data.p1score === data.p2score) return;

  const p1Points = await prisma.playerScore.findUnique({
    where: { gameid_playerid: { gameid: data.gameid, playerid: data.p1id } },
    select: { points: true },
  });
  const p2Points = await prisma.playerScore.findUnique({
    where: { gameid_playerid: { gameid: data.gameid, playerid: data.p2id } },
    select: { points: true },
  });
  const p1TotalPoints = p1Points?.points || 100;
  const p2TotalPoints = p2Points?.points || 100;

  const winnerTotalPoints = data.p1score > data.p2score ? p1TotalPoints : p2TotalPoints;
  const loserTotalPoints = data.p1score > data.p2score ? p2TotalPoints : p1TotalPoints;

  const p2Multiplier = data.p1score > data.p2score ? -1 : 1;
  const multiplier = Math.log10(Math.abs(loserTotalPoints / winnerTotalPoints) + 1) / Math.log10(2);
  const pointsToMove = Math.floor(10 * multiplier);

  const p1NewScore = p1TotalPoints + pointsToMove;
  const p2NewScore = p2TotalPoints + pointsToMove * p2Multiplier;

  if (p1Points) {
    await prisma.playerScore.update({
      where: { gameid_playerid: { gameid: data.gameid, playerid: data.p1id } },
      data: { points: p1NewScore },
    });
  } else {
    await prisma.playerScore.create({
      data: { points: p1NewScore, gameid: data.gameid, playerid: data.p1id },
    });
  }

  if (p2Points) {
    await prisma.playerScore.update({
      where: { gameid_playerid: { gameid: data.gameid, playerid: data.p2id } },
      data: { points: p2NewScore },
    });
  } else {
    await prisma.playerScore.create({
      data: { points: p2NewScore, gameid: data.gameid, playerid: data.p2id },
    });
  }
};

const pointsHandler: NextApiHandler<MatchesAPIResponse> = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ status: 'error', message: 'Unauthorised' });
  if (req.body.p1id !== session.user.id) return res.status(400).json({ status: 'error', message: 'Unauthorised' });

  await calculateMatchPoints({
    p1score: req.body.p1score,
    p2score: req.body.p2score,
    p1id: req.body.p1id,
    p2id: req.body.p2id,
    gameid: req.body.gameid,
  });

  await prisma.match.create({
    data: {
      createdAt: new Date().toISOString(),
      p1score: req.body.p1score,
      p2score: req.body.p2score,
      p1: { connect: { id: req.body.p1id } },
      p2: { connect: { id: req.body.p2id } },
      game: { connect: { id: req.body.gameid } },
    },
  });

  res.status(200).json({ status: 'ok' });
};

export default pointsHandler;

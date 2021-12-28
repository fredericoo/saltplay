import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { Match } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { APIResponse } from '@/lib/types/api';
import { calculateMatchPoints } from '@/lib/leaderboard';

const updatePlayerPoints = async (data: Pick<Match, 'gameid' | 'p1id' | 'p2id' | 'p1score' | 'p2score'>) => {
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

  const matchPoints = calculateMatchPoints(p1TotalPoints, p2TotalPoints, data.p1score - data.p2score);

  const p1NewScore = p1TotalPoints + matchPoints * (data.p1score > data.p2score ? 1 : -1);
  const p2NewScore = p2TotalPoints + matchPoints * (data.p2score > data.p1score ? 1 : -1);

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

const matchesHandler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') return await postHandler(req, res);
  return res.status(405).json({ status: 'error', message: 'Method not allowed' });
};

export type MatchesPOSTAPIResponse = APIResponse;

const postHandler: NextApiHandler<MatchesPOSTAPIResponse> = async (req, res) => {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ status: 'error', message: 'Unauthorised' });
  if (req.body.p1id !== session.user.id) return res.status(400).json({ status: 'error', message: 'Unauthorised' });

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

  await updatePlayerPoints({
    p1score: req.body.p1score,
    p2score: req.body.p2score,
    p1id: req.body.p1id,
    p2id: req.body.p2id,
    gameid: req.body.gameid,
  });

  res.status(200).json({ status: 'ok' });
};

export default matchesHandler;

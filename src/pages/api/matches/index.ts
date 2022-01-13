import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { Match } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { APIResponse } from '@/lib/types/api';
import { calculateMatchPoints, STARTING_POINTS } from '@/lib/leaderboard';
import { PromiseElement } from '@/lib/types/utils';
import { notifyMatchOnSlack } from '@/lib/slackbot/notifyMatch';

const updatePlayerPoints = async (data: Pick<Match, 'gameid' | 'p1id' | 'p2id' | 'p1score' | 'p2score'>) => {
  const p1Points = await prisma.playerScore.findUnique({
    where: { gameid_playerid: { gameid: data.gameid, playerid: data.p1id } },
    select: { points: true },
  });
  const p2Points = await prisma.playerScore.findUnique({
    where: { gameid_playerid: { gameid: data.gameid, playerid: data.p2id } },
    select: { points: true },
  });
  const p1TotalPoints = p1Points?.points || STARTING_POINTS;
  const p2TotalPoints = p2Points?.points || STARTING_POINTS;

  const matchPoints = calculateMatchPoints(p1TotalPoints, p2TotalPoints, data.p1score - data.p2score);

  if (process.env.ENABLE_SLACK_MATCH_NOTIFICATION) {
    try {
      await notifyMatchOnSlack({
        gameId: data.gameid,
        p1: { id: data.p1id, score: data.p1score },
        p2: { id: data.p2id, score: data.p2score },
      });
    } catch {
      console.error('Failed to notify match on slack');
    }
  }

  if (data.p1score === data.p2score) return;

  const p1NewScore = p1TotalPoints + matchPoints * (data.p1score > data.p2score ? 1 : -1);
  const p2NewScore = p2TotalPoints + matchPoints * (data.p2score > data.p1score ? 1 : -1);

  await prisma.playerScore.upsert({
    where: { gameid_playerid: { gameid: data.gameid, playerid: data.p1id } },
    update: { points: p1NewScore },
    create: { points: p1NewScore, gameid: data.gameid, playerid: data.p1id },
  });

  await prisma.playerScore.upsert({
    where: { gameid_playerid: { gameid: data.gameid, playerid: data.p2id } },
    update: { points: p2NewScore },
    create: { points: p2NewScore, gameid: data.gameid, playerid: data.p2id },
  });

  return matchPoints;
};

export type MatchesPOSTAPIResponse = APIResponse;

const postHandler: NextApiHandler<MatchesPOSTAPIResponse> = async (req, res) => {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ status: 'error', message: 'Unauthorised' });
  if (req.body.p1id !== session.user.id) return res.status(400).json({ status: 'error', message: 'Unauthorised' });

  const matchPoints = await updatePlayerPoints({
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
      points: matchPoints,
    },
  });

  res.status(200).json({ status: 'ok' });
};

const getMatches = (take: number, cursor?: Pick<Match, 'id'>) =>
  prisma.match.findMany({
    orderBy: { createdAt: 'desc' },
    cursor,
    skip: cursor ? 1 : 0,
    take,
    select: {
      game: {
        select: {
          name: true,
          icon: true,
          office: {
            select: {
              name: true,
            },
          },
        },
      },
      id: true,
      createdAt: true,
      p1: { select: { name: true, id: true, image: true } },
      p2: { select: { name: true, id: true, image: true } },
      p1score: true,
      p2score: true,
    },
  });

export type MatchesGETAPIResponse = APIResponse<{
  matches: PromiseElement<ReturnType<typeof getMatches>>;
  nextCursor?: Match['id'];
}>;

const getHandler: NextApiHandler<MatchesGETAPIResponse> = async (req, res) => {
  const cursor = typeof req.query.cursor === 'string' ? { id: req.query.cursor } : undefined;
  const take = Math.min(+req.query.count, 20) || 3;
  const matches = await getMatches(take, cursor);
  const nextCursor = matches.length >= take ? matches[matches.length - 1].id : undefined;

  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=60');
  res.status(200).json({ status: 'ok', matches, nextCursor });
};

const matchesHandler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') return await postHandler(req, res);
  if (req.method === 'GET') return await getHandler(req, res);
  return res.status(405).json({ status: 'error', message: 'Method not allowed' });
};

export default matchesHandler;

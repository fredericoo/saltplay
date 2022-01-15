import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { STARTING_POINTS } from '@/lib/leaderboard';

export type MatchesDELETEAPIResponse = APIResponse;

const deleteHandler: NextApiHandler<MatchesDELETEAPIResponse> = async (req, res) => {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

  const matchId = req.query.id;
  if (typeof matchId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid match id' });

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: {
      id: true,
      left: { select: { id: true } },
      right: { select: { id: true } },
      gameid: true,
      leftscore: true,
      rightscore: true,
      points: true,
    },
  });

  if (!match || !match.left.find(player => player.id === session.user.id))
    return res.status(404).json({ status: 'error', message: 'Match not found' });

  const multiplier = match.leftscore > match.rightscore ? 1 : -1;

  await Promise.all(
    match.left.map(async player => {
      await prisma.playerScore.upsert({
        where: {
          gameid_playerid: {
            gameid: match.gameid,
            playerid: player.id,
          },
        },
        update: {
          points: {
            decrement: match.points * multiplier,
          },
        },
        create: {
          points: STARTING_POINTS,
          gameid: match.gameid,
          playerid: player.id,
        },
      });
    })
  );

  await Promise.all(
    match.right.map(async player => {
      await prisma.playerScore.upsert({
        where: {
          gameid_playerid: {
            gameid: match.gameid,
            playerid: player.id,
          },
        },
        update: {
          points: {
            increment: match.points * multiplier,
          },
        },
        create: {
          points: STARTING_POINTS,
          gameid: match.gameid,
          playerid: player.id,
        },
      });
    })
  );

  await prisma.match.delete({
    where: { id: matchId },
  });

  return res.status(200).json({ status: 'ok' });
};

const matchesHandler: NextApiHandler = async (req, res) => {
  if (req.method === 'DELETE') return await deleteHandler(req, res);
  return res.status(405).json({ status: 'error', message: 'Method not allowed' });
};

export default matchesHandler;

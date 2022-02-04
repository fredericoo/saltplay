import { MATCH_DELETE_DAYS } from '@/lib/constants';
import { STARTING_POINTS } from '@/lib/leaderboard';
import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { differenceInDays } from 'date-fns';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth/next';
import { nextAuthOptions } from '../../auth/[...nextauth]';

export type MatchesDELETEAPIResponse = APIResponse;

const deleteHandler: NextApiHandler<MatchesDELETEAPIResponse> = async (req, res) => {
  const session = await getServerSession({ req, res }, nextAuthOptions);
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
      createdAt: true,
    },
  });

  if (!match || !match.left.find(player => player.id === session.user.id))
    return res.status(404).json({ status: 'error', message: 'Match not found' });

  if (differenceInDays(new Date(), new Date(match.createdAt)) > MATCH_DELETE_DAYS) {
    return res.status(400).json({ status: 'error', message: 'Match is too old to delete' });
  }

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

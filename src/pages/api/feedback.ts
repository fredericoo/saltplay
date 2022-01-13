import { APIResponse } from '@/lib/types/api';
import { User } from '@prisma/client';
import type { NextApiHandler } from 'next';
import prisma from '@/lib/prisma';
import { FeedbackFormData } from '@/components/FeedbackForm/FeedbackForm';

export type FeedbackAPIResponse = APIResponse;

const handler: NextApiHandler<FeedbackAPIResponse> = async (req, res) => {
  const { rating, playerId, text } = req.body as FeedbackFormData & { playerId: User['id'] };

  if (req.method !== 'POST') {
    res.status(403).json({ status: 'error', message: 'Invalid method' });
    return;
  }

  try {
    await prisma.feedback.create({
      data: {
        createdAt: new Date().toISOString(),
        rating,
        text,
        player: playerId
          ? {
              connect: {
                id: playerId,
              },
            }
          : undefined,
      },
    });
  } catch (err) {
    console.warn(err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }

  res.status(200).json({
    status: 'ok',
  });
};

export default handler;

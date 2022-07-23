import type { FeedbackFormData } from '@/components/FeedbackForm/FeedbackForm';
import prisma from '@/lib/prisma';
import type { APIResponse } from '@/lib/types/api';
import type { User } from '@prisma/client';
import type { NextApiHandler } from 'next';

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

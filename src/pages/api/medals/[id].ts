import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { NextApiHandler } from 'next';

const getMedal = (id: string) =>
  prisma.medal.findUnique({
    where: { id },
    select: { name: true, image: true },
  });

export type BadgeSuccessAPIResponse = { medal: Awaited<ReturnType<typeof getMedal>> };
export type BadgeAPIResponse = APIResponse<BadgeSuccessAPIResponse>;

const medalHandler: NextApiHandler<BadgeAPIResponse> = async (req, res) => {
  const { id } = req.query;

  if (typeof id !== 'string') {
    res.status(400).json({ status: 'error', message: 'Bad request' });
    return;
  }

  const medal = await getMedal(id);

  if (!medal) {
    res.status(404).json({ status: 'error', message: 'Not found' });
    return;
  }

  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.status(200).json({ status: 'ok', data: { medal } });
};

export default medalHandler;

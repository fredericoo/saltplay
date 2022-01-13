import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { APIResponse } from '@/lib/types/api';
import { PromiseElement } from '@/lib/types/utils';

const getUsers = () =>
  prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  });

export type DevUsersAPIResponse = APIResponse<{
  users: PromiseElement<ReturnType<typeof getUsers>>;
}>;

const devUsersHandler: NextApiHandler<DevUsersAPIResponse> = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN !== 'true')
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });

  const users = await getUsers();

  res.status(200).json({
    status: 'ok',
    users,
  });
};

export default devUsersHandler;

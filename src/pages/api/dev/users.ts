import prisma from '@/lib/prisma';
import type { APIResponse } from '@/lib/types/api';
import type { NextApiHandler } from 'next';

const getUsers = () =>
  prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  });

export type DevUsersAPIResponse = APIResponse<{
  users: Awaited<ReturnType<typeof getUsers>>;
}>;

const devUsersHandler: NextApiHandler<DevUsersAPIResponse> = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN !== 'true')
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });

  const users = await getUsers();

  if (users.length === 0) {
    const newUsers = [
      await prisma.user.create({
        data: { name: 'admin', email: Math.random().toString(36).substring(2) + '@wrkplay.com', roleId: 0 },
      }),
    ];
    return res.status(200).json({
      status: 'ok',
      data: { users: newUsers },
    });
  }

  res.status(200).json({
    status: 'ok',
    data: { users },
  });
};

export default devUsersHandler;

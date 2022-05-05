import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';

export type ExistingSlackUsersAPIResponse = APIResponse<{
  userIds: Awaited<ReturnType<typeof getExistingUserIds>>;
}>;

const getExistingUserIds = async () => {
  const existingUsers = await prisma.user.findMany({
    select: { accounts: { where: { provider: 'slack' }, select: { providerAccountId: true } } },
  });
  const existingUserIds = existingUsers.map(user => user.accounts[0]?.providerAccountId);
  return existingUserIds;
};

const existingSlackUsersHandler: NextApiHandler<ExistingSlackUsersAPIResponse> = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });

  const session = await getServerSession({ req, res }, nextAuthOptions);
  if (!session) return res.status(403).json({ status: 'error', message: 'Not logged in' });

  const userIds = await getExistingUserIds();
  res.status(200).json({ status: 'ok', data: { userIds } });
};

export default existingSlackUsersHandler;

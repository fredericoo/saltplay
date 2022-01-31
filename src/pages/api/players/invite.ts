import prisma from '@/lib/prisma';
import getAllSlackMembers from '@/lib/slackbot/getAllSlackMembers';
import { APIResponse } from '@/lib/types/api';
import { PromiseElement } from '@/lib/types/utils';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';

export type InvitePlayersAPIResponse = APIResponse<{
  users: PromiseElement<ReturnType<typeof getAllNonExistingSlackMembers>>;
}>;

const getAllNonExistingSlackMembers = async () => {
  const allUsers = await getAllSlackMembers();

  const existingUsers = await prisma.user.findMany({
    select: { accounts: { where: { provider: 'slack' }, select: { providerAccountId: true } } },
  });

  return allUsers?.filter(
    user =>
      !existingUsers?.find(
        existingUser => !!existingUser?.accounts?.find(account => account?.providerAccountId === user.id)
      )
  );
};

const invitedUsersHandler: NextApiHandler<InvitePlayersAPIResponse> = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });

  const session = await getServerSession({ req, res }, nextAuthOptions);
  if (!session) return res.status(403).json({ status: 'error', message: 'Not logged in' });
  const users = await getAllNonExistingSlackMembers();
  res.status(200).json({ status: 'ok', users });
};

export default invitedUsersHandler;

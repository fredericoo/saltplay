import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { PromiseElement } from '@/lib/types/utils';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';
import { AllSlackMembersAPIResponse } from '../dev/all-slack-members';

export type InvitePlayersAPIResponse = APIResponse<{
  users: PromiseElement<ReturnType<typeof getAllNonExistingSlackMembers>>;
}>;

const getAllNonExistingSlackMembers = async (basePath?: string) => {
  if (!basePath) return [];
  const allUsers: AllSlackMembersAPIResponse = await fetch(basePath + '/api/dev/all-slack-members').then(res =>
    res.json()
  );

  const existingUsers = await prisma.user.findMany({
    select: { accounts: { where: { provider: 'slack' }, select: { providerAccountId: true } } },
  });

  return allUsers.members?.filter(
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

  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const users = await getAllNonExistingSlackMembers(`${protocol}://${req.headers.host}`);

  res.status(200).json({ status: 'ok', users });
};

export default invitedUsersHandler;

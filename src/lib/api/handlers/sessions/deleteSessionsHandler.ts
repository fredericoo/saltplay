import prisma, { getErrorStack } from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';

export type SessionsDELETEAPIResponse = APIResponse;

const deleteSessionsHandler: NextApiHandler<SessionsDELETEAPIResponse> = async (req, res) => {
  const session = await getServerSession({ req, res }, nextAuthOptions);
  const canEdit = canViewDashboard(session?.user.roleId);
  if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

  return await prisma.session
    .deleteMany()
    .then(() => res.status(200).json({ status: 'ok' }))
    .catch((error: PrismaClientKnownRequestError) => {
      const stack = getErrorStack(error);
      return res.status(400).json({ status: 'error', stack });
    });
};

export default deleteSessionsHandler;

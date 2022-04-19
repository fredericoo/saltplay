import prisma from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { Session } from '@prisma/client';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';
import { object, string } from 'yup';

export type SessionDELETEAPIResponse = APIResponse<Session>;

const querySchema = object().shape({
  id: string(),
});

const deleteSessionHandler: NextApiHandler<SessionDELETEAPIResponse> = async (req, res) => {
  await querySchema
    .validate(req.query, { abortEarly: false })
    .then(async query => {
      const session = await getServerSession({ req, res }, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      const deletedSession = await prisma.session.delete({ where: { id: query.id } });

      res.status(200).json({ status: 'ok', data: deletedSession });
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ status: 'error', message: err.errors[0].message });
    });
};

export default deleteSessionHandler;

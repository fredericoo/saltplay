import { patchUserSchema } from '@/lib/api/schemas';
import prisma from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { User } from '@prisma/client';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';

export type UserPATCHAPIResponse = APIResponse<User>;

const patchUserHandler: NextApiHandler<UserPATCHAPIResponse> = async (req, res) => {
  await patchUserSchema
    .validate(req.body, { abortEarly: false, stripUnknown: true })
    .then(async body => {
      const session = await getServerSession({ req, res }, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      const id = req.query.id;

      if (typeof id !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid game id' });
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      try {
        const user = await prisma.user.update({
          where: { id },
          data: body,
        });
        res.status(200).json({ status: 'ok', data: user });
      } catch (e) {
        console.error(e);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ status: 'error', message: err.errors[0].message });
    });
};

export default patchUserHandler;

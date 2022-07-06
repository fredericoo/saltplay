import { patchUserSchemaAdmin, patchUserSchemaSelf } from '@/lib/api/schemas';
import prisma from '@/lib/prisma';
import revalidateStaticPages from '@/lib/revalidateStaticPages';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { Prisma, User } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
import { NextApiHandler } from 'next';
import { unstable_getServerSession } from 'next-auth';
import userReturnData from './userReturnData';

const updateUser = ({ id, data }: Pick<User, 'id'> & Pick<Prisma.UserUpdateArgs, 'data'>) =>
  prisma.user.update({
    where: { id },
    data,
    select: userReturnData(),
  });

export type UserPATCHAPIResponse = APIResponse<Awaited<ReturnType<typeof updateUser>>>;

const patchUserHandler: NextApiHandler<UserPATCHAPIResponse> = async (req, res) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  const id = req.query.id;
  if (typeof id !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid user id' });

  const isAdmin = canViewDashboard(session?.user.roleId);
  const isSelf = session?.user.id === req.query.id;
  const schema = isAdmin ? patchUserSchemaAdmin : isSelf ? patchUserSchemaSelf : undefined;

  if (!schema) return res.status(500).json({ status: 'error', message: 'Unauthorised' });

  await schema
    .validate(req.body, { abortEarly: false, stripUnknown: true })
    .then(async data => {
      try {
        const user = await updateUser({ id, data });
        await revalidateStaticPages([`/player/${user.id}`], res);
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

export default withSentry(patchUserHandler);

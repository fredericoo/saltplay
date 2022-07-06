import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { User } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
import { NextApiHandler } from 'next';
import { object, string } from 'yup';
import userReturnData from './userReturnData';

const getUser = ({ id }: Pick<User, 'id'>) =>
  prisma.user.findUnique({
    where: { id },
    select: userReturnData(),
  });

type UserGETAPIResponseSuccess = NonNullable<Awaited<ReturnType<typeof getUser>>>;

export type UserGETAPIResponse = APIResponse<UserGETAPIResponseSuccess>;

const querySchema = object({
  id: string().required(),
});

const getUserHandler: NextApiHandler<UserGETAPIResponse> = async (req, res) => {
  await querySchema
    .validate(req.query, { abortEarly: false, stripUnknown: true })
    .then(async ({ id }) => {
      const user = await getUser({ id });
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

      return res.status(200).json({ status: 'ok', data: user });
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ status: 'error', message: err.errors[0].message });
    });
};

export default withSentry(getUserHandler);

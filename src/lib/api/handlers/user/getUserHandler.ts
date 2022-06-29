import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { User } from '@prisma/client';
import { NextApiHandler } from 'next';
import { object, string } from 'yup';

const getUser = (id: User['id']) =>
  prisma.user.findUnique({
    where: { id },
    select: {
      boastId: true,
      medals: {
        select: {
          name: true,
          id: true,
          holographic: true,
          seasonid: true,
        },
      },
    },
  });

type UserGETAPIResponseSuccess = NonNullable<Awaited<ReturnType<typeof getUser>>>;

export type UserGETAPIResponse = APIResponse<UserGETAPIResponseSuccess>;

const querySchema = object({
  id: string().required(),
});

const getUserHandler: NextApiHandler<UserGETAPIResponse> = async (req, res) => {
  await querySchema
    .validate(req.query, { abortEarly: false, stripUnknown: true })
    .then(async query => {
      const user = await getUser(query.id);
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

      return res.status(200).json({ status: 'ok', data: user });
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ status: 'error', message: err.errors[0].message });
    });
};

export default getUserHandler;

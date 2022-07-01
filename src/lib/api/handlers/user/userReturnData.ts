import { getExactTypeFor } from '@/lib/types/utils';
import { Prisma } from '@prisma/client';

type UserSelect = Prisma.UserUpdateArgs['select'];

const userReturnData = () => {
  const userSelect = getExactTypeFor<UserSelect>()({
    id: true,
    name: true,
    boastId: true,
    medals: {
      select: {
        id: true,
        seasonid: true,
      },
    },
  });
  return userSelect;
};

export default userReturnData;

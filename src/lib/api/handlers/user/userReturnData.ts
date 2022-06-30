import { getExactTypeFor } from '@/lib/types/utils';
import { Prisma } from '@prisma/client';

type UserSelect = Prisma.UserUpdateArgs['select'];

const userReturnData = (options?: { includeMedals?: boolean }) => {
  const userSelect = getExactTypeFor<UserSelect>()({
    id: true,
    name: true,
    boastId: options?.includeMedals,
    medals: options?.includeMedals && {
      select: {
        id: true,
        image: true,
        holographic: true,
        seasonid: true,
      },
    },
  });
  return userSelect;
};

export default userReturnData;

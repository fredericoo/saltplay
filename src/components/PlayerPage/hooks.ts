import type { UserGETAPIResponse } from '@/lib/api/handlers/user/getUserHandler';
import type { UserPATCHAPIResponse } from '@/lib/api/handlers/user/patchUserHandler';
import type { User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type UpdateMedalParams = { userId: User['id'] };

export const useSetBoast = ({ userId }: UpdateMedalParams) => {
  const queryClient = useQueryClient();

  const { mutate: setBoast, ...rest } = useMutation(
    async (boastId: User['boastId']) => {
      return axios.patch<UserPATCHAPIResponse>(`/api/users/${userId}`, { boastId }).then(res => res.data);
    },
    {
      onMutate: async boastId => {
        await queryClient.cancelQueries(['users', userId]);

        const previousData = queryClient.getQueryData<UserGETAPIResponse>(['users', userId]);

        queryClient.setQueryData(['users', userId], { ...previousData, data: { ...previousData?.data, boastId } });

        return { previousData };
      },
      onError: (err, _, context) => {
        queryClient.setQueryData(['users', userId], context?.previousData);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['users', userId]);
      },
    }
  );

  return { setBoast, ...rest };
};

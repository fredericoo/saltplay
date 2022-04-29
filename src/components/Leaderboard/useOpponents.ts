import fetcher from '@/lib/fetcher';
import { OpponentsAPIResponse } from '@/pages/api/games/[id]/opponents';
import { Game } from '@prisma/client';
import useSWR, { SWRResponse } from 'swr';

type UseOpponents = (options: { gameId?: Game['id'] }) => SWRResponse<OpponentsAPIResponse>;

const useOpponents: UseOpponents = ({ gameId }) => {
  return useSWR<OpponentsAPIResponse>(`/api/games/${gameId}/opponents`, fetcher);
};

export default useOpponents;

import { OpponentsAPIResponse } from '@/pages/api/games/[id]/opponents';
import { Game, Season } from '@prisma/client';
import useSWR, { SWRResponse } from 'swr';

type UseOpponents = (options: { gameId?: Game['id']; seasonId?: Season['id'] }) => SWRResponse<OpponentsAPIResponse>;

const useOpponents: UseOpponents = ({ gameId, seasonId }) => {
  const baseUrl = `/api/games/${gameId}/opponents`;
  const query = seasonId ? `seasonId=${seasonId}` : '';

  return useSWR<OpponentsAPIResponse>(gameId ? [baseUrl, query].join('?') : null);
};

export default useOpponents;

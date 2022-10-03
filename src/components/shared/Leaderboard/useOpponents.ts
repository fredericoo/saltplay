import { createFetcher } from '@/lib/fetcher';
import type { OpponentsAPIResponse } from '@/pages/api/games/[id]/opponents';
import type { Game, Season } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type UseOpponentsParams = { gameId?: Game['id']; seasonId?: Season['id'] };

const useOpponents = ({ gameId, seasonId }: UseOpponentsParams) => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries(['opponents', { gameId }]);

  const baseUrl = `/api/games/${gameId}/opponents`;
  const queryParams = seasonId ? `seasonId=${seasonId}` : '';
  const query = useQuery(
    ['opponents', { gameId }],
    createFetcher<OpponentsAPIResponse>([baseUrl, queryParams].join('?'))
  );
  return { ...query, invalidate };
};

export default useOpponents;

import type {
  LeaderboardGETAPIResponse,
  LeaderboardGETOptions,
} from '@/lib/api/handlers/leaderboard/getLeaderboardHandler';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

type UseLeaderboardParams = Partial<Pick<LeaderboardGETOptions, 'gameId' | 'userId' | 'seasonId'>>;

const useLeaderboard = (options: UseLeaderboardParams) => {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => {
    return ['leaderboard', options];
  }, [options]);

  const invalidate = () => queryClient.invalidateQueries(queryKey);

  const query = useInfiniteQuery(
    queryKey,
    async ({ pageParam = 1 }) => {
      const searchParams = new URLSearchParams(JSON.parse(JSON.stringify(options)));
      searchParams.set('perPage', '20');
      pageParam && searchParams.set('after', pageParam);

      const res: LeaderboardGETAPIResponse = await fetch([`/api/leaderboard`, searchParams.toString()].join('?')).then(
        res => res.json()
      );
      return res;
    },
    {
      refetchInterval: 1000 * 60,
      getNextPageParam: lastPage => {
        if (options.userId) return undefined;
        if (!options.gameId && !options.userId) return undefined;
        if (lastPage && !lastPage.pageInfo?.nextPage) return undefined; // reached the end
        return lastPage?.pageInfo?.nextPage;
      },
    }
  );

  return { ...query, invalidate };
};

export default useLeaderboard;

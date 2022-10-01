import type { GetMatchesOptions, MatchesGETAPIResponse } from '@/lib/api/handlers/match/getMatchesHandler';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

type UseLatestMatchesParams = Partial<Pick<GetMatchesOptions, 'gameId' | 'officeId' | 'seasonId' | 'userId'>>;

const useLatestMatches = (options: UseLatestMatchesParams) => {
  const queryKey = useMemo(() => {
    return ['matches', options];
  }, [options]);

  return useInfiniteQuery(
    queryKey,
    async ({ pageParam }) => {
      const searchParams = new URLSearchParams(JSON.parse(JSON.stringify(options)));
      pageParam && searchParams.set('after', pageParam);

      const res: MatchesGETAPIResponse = await fetch([`/api/matches`, searchParams.toString()].join('?')).then(res =>
        res.json()
      );
      return res;
    },
    {
      getNextPageParam: lastPage => {
        if (lastPage && !lastPage?.pageInfo?.nextCursor) return undefined;
        return lastPage?.pageInfo?.nextCursor;
      },
    }
  );
};

export default useLatestMatches;

import type { GetMatchesOptions, MatchesGETAPIResponse } from '@/lib/api/handlers/match/getMatchesHandler';
import type { SWRInfiniteResponse } from 'swr/infinite';
import useSWRInfinite from 'swr/infinite';

const getKey =
  (options: Partial<GetMatchesOptions>) => (pageIndex: number, previousPageData: MatchesGETAPIResponse) => {
    if (previousPageData && !previousPageData?.pageInfo?.nextCursor) return null; // reached the end
    const queryParams = Object.entries({
      after: pageIndex > 0 ? previousPageData?.pageInfo?.nextCursor : undefined,
      ...options,
    })
      .filter(([, value]) => value)
      .map(entry => entry.join('='))
      .join('&');
    return ['/api/matches', queryParams].join('?');
  };

type UseLatestMatches = (
  options: Partial<Pick<GetMatchesOptions, 'gameId' | 'officeId' | 'seasonId' | 'userId'>>
) => SWRInfiniteResponse<MatchesGETAPIResponse>;

const useLatestMatches: UseLatestMatches = options => {
  return useSWRInfinite<MatchesGETAPIResponse>(getKey(options));
};

export default useLatestMatches;

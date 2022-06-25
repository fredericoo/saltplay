import { LeaderboardGETAPIResponse, LeaderboardGETOptions } from '@/lib/api/handlers/leaderboard/getLeaderboardHandler';
import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite';

const getKey =
  (options: Partial<LeaderboardGETOptions>) => (pageIndex: number, previousPageData: LeaderboardGETAPIResponse) => {
    if (options.userId) return null;
    if (!options.gameId && !options.userId) return null;
    if (previousPageData && !previousPageData.pageInfo?.nextPage) return null; // reached the end
    const queryParams = Object.entries({
      page: pageIndex > 0 ? previousPageData?.pageInfo?.nextPage : undefined,
      ...options,
    })
      .filter(([, value]) => value)
      .map(entry => entry.join('='))
      .join('&');
    return [`/api/leaderboard`, queryParams].join('?');
  };

type UseLeaderboard = (
  options: Partial<Pick<LeaderboardGETOptions, 'gameId' | 'userId' | 'seasonId'>>
) => SWRInfiniteResponse<LeaderboardGETAPIResponse>;

const useLeaderboard: UseLeaderboard = options => {
  return useSWRInfinite<LeaderboardGETAPIResponse>(getKey({ ...options, perPage: 20 }), {
    refreshInterval: 1000 * 60,
    revalidateAll: true,
  });
};

export default useLeaderboard;

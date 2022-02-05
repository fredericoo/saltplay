import { LeaderboardGETAPIResponse, LeaderboardGETOptions } from '@/lib/api/handlers/getLeaderboardHandler';
import { Game } from '@prisma/client';
import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite';

const getKey =
  (options: Partial<LeaderboardGETOptions>) => (pageIndex: number, previousPageData: LeaderboardGETAPIResponse) => {
    if (previousPageData && !previousPageData.nextPage) return null; // reached the end
    const queryParams = Object.entries({ page: pageIndex > 0 ? previousPageData.nextPage : undefined, ...options })
      .filter(([, value]) => value)
      .map(entry => entry.join('='))
      .join('&');
    return [`/api/leaderboard`, queryParams].join('?');
  };

type UseLeaderboard = (options: { gameId?: Game['id'] }) => SWRInfiniteResponse<LeaderboardGETAPIResponse>;

const useLeaderboard: UseLeaderboard = ({ gameId }) => {
  return useSWRInfinite<LeaderboardGETAPIResponse>(getKey({ gameId, perPage: 20 }), { refreshInterval: 1000 * 60 });
};

export default useLeaderboard;

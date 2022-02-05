import { GetMatchesOptions, MatchesGETAPIResponse } from '@/lib/api/handlers/getMatchesHandler';
import { Game, User } from '@prisma/client';
import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite';

const getKey =
  (options: Partial<GetMatchesOptions>) => (pageIndex: number, previousPageData: MatchesGETAPIResponse) => {
    if (previousPageData && !previousPageData.nextCursor) return null; // reached the end
    const queryParams = Object.entries({ after: pageIndex > 0 ? previousPageData.nextCursor : undefined, ...options })
      .filter(([, value]) => value)
      .map(entry => entry.join('='))
      .join('&');
    return ['/api/matches', queryParams].join('?');
  };

type UseLatestMatches = (options: {
  gameId?: Game['id'];
  userId?: User['id'];
}) => SWRInfiniteResponse<MatchesGETAPIResponse>;

const useLatestMatches: UseLatestMatches = ({ gameId, userId }) => {
  return useSWRInfinite<MatchesGETAPIResponse>(getKey({ gameId, userId }));
};

export default useLatestMatches;

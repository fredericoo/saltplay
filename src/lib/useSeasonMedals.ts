import type { Season } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import type { SeasonMedalsGETAPIResponse } from './api/handlers/season/getSeasonMedalsHandler';
import { createFetcher } from './fetcher';

const useSeasonMedals = (seasonId: Season['id']) => {
  return useQuery(
    ['medals', { seasonId }],
    createFetcher<SeasonMedalsGETAPIResponse>(`/api/seasons/${seasonId}/medals`),
    { staleTime: Infinity }
  );
};

export default useSeasonMedals;

import { Season } from '@prisma/client';
import useSWR from 'swr';
import { SeasonMedalsGETAPIResponse } from './api/handlers/season/getSeasonMedalsHandler';

const useSeasonMedals = (seasonId: Season['id']) => {
  return useSWR<SeasonMedalsGETAPIResponse>(`/api/seasons/${seasonId}/medals`, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });
};

export default useSeasonMedals;

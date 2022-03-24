import fetcher from '@/lib/fetcher';
import { OfficeStatsAPIResponse } from '@/pages/api/offices/[id]/stats';
import { Office } from '@prisma/client';
import useSWR from 'swr';
import Stat from '../Stat';

type OfficeStatProps = {
  id?: Office['id'];
  stat: 'matchesCount' | 'playerCount' | 'mostPlayedGame';
};

const labels = {
  matchesCount: 'Matches',
  playerCount: 'Players',
  mostPlayedGame: 'Most played game',
};

const OfficeStat: React.VFC<OfficeStatProps> = ({ id, stat }) => {
  const { data, error } = useSWR<OfficeStatsAPIResponse>(id ? `/api/offices/${id}/stats` : null, fetcher, {
    revalidateOnFocus: false,
  });
  if (!id || error) return null;
  return <Stat label={labels[stat]} content={data?.[stat]} isLoading={typeof data === 'undefined'} />;
};

export default OfficeStat;

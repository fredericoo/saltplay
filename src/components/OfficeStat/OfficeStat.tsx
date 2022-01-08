import fetcher from '@/lib/fetcher';
import { OfficeStatsAPIResponse } from '@/pages/api/offices/[id]/stats';
import { Skeleton, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { Office } from '@prisma/client';
import useSWR from 'swr';

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
  const { data, error } = useSWR<OfficeStatsAPIResponse>(id ? `/api/offices/${id}/stats` : null, fetcher);
  if (!id || error) return null;
  return (
    <Stat bg="gray.200" borderRadius="xl" p={4}>
      <StatLabel fontSize="md" color="gray.500" mb={2}>
        {labels[stat]}
      </StatLabel>
      <StatNumber fontSize="2xl" fontWeight="normal" lineHeight={1}>
        <Skeleton isLoaded={!!data}>{data ? data?.[stat] : '…'}</Skeleton>
      </StatNumber>
    </Stat>
  );
};

export default OfficeStat;

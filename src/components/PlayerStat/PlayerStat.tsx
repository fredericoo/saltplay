import fetcher from '@/lib/fetcher';
import { PlayerStatsAPIResponse } from '@/pages/api/players/[id]/stats';
import { Skeleton, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { User } from '@prisma/client';
import useSWR from 'swr';

type PlayerStatProps = {
  id?: User['id'];
  stat: 'played' | 'won' | 'lost';
};

const labels = {
  played: '🏁 matches played',
  won: '🏆 matches won',
  lost: '😢 matches lost',
};

const PlayerStat: React.VFC<PlayerStatProps> = ({ id, stat }) => {
  const { data, error } = useSWR<PlayerStatsAPIResponse>(id ? `/api/players/${id}/stats` : null, fetcher);
  if (!id || error) return null;
  return (
    <Stat bg="white" borderRadius="xl" p={4}>
      <StatLabel fontSize="md" color="gray.600" mb={2}>
        {labels[stat]}
      </StatLabel>
      <StatNumber fontSize="4xl" fontWeight="normal" lineHeight={1}>
        <Skeleton isLoaded={!!data}>{data ? data?.[stat] : '…'}</Skeleton>
      </StatNumber>
    </Stat>
  );
};

export default PlayerStat;

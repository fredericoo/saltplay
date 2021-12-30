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
  played: 'Matches played',
  won: 'Matches won',
  lost: 'Matches lost',
};

const PlayerStat: React.VFC<PlayerStatProps> = ({ id, stat }) => {
  const { data, error } = useSWR<PlayerStatsAPIResponse>(id ? `/api/players/${id}/stats` : null, fetcher);
  if (!id || error) return null;
  return (
    <Stat>
      <StatLabel>{labels[stat]}</StatLabel>
      <StatNumber>
        <Skeleton isLoaded={!!data}>{data?.[stat]}</Skeleton>
      </StatNumber>
    </Stat>
  );
};

export default PlayerStat;

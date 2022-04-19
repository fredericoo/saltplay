import fetcher from '@/lib/fetcher';
import { PlayerStatsAPIResponse } from '@/pages/api/players/[id]/stats';
import { User } from '@prisma/client';
import useSWR from 'swr';
import Stat from '../Stat';

type PlayerStatProps = {
  id?: User['id'];
  stat: 'played' | 'won' | 'lost';
};

const labels = {
  played: 'Played',
  won: 'Won',
  lost: 'Lost',
};

const PlayerStat: React.VFC<PlayerStatProps> = ({ id, stat }) => {
  const { data: playerStats, error } = useSWR<PlayerStatsAPIResponse>(id ? `/api/players/${id}/stats` : null, fetcher, {
    revalidateOnFocus: false,
  });
  if (!id || error) return null;
  return (
    <Stat label={labels[stat]} content={playerStats?.data?.[stat]} isLoading={typeof playerStats === 'undefined'} />
  );
};

export default PlayerStat;

import fetcher from '@/lib/fetcher';
import { PlayerStatsAPIResponse } from '@/pages/api/players/[id]/stats';
import { Skeleton, Stack, Text } from '@chakra-ui/react';
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
  const { data, error } = useSWR<PlayerStatsAPIResponse>(id ? `/api/players/${id}/stats` : null, fetcher, {
    revalidateOnFocus: false,
  });
  if (!id || error) return null;
  return (
    <Stack bg="gray.200" borderRadius="xl" p={4} spacing={0} flex={1}>
      <Text fontSize="md" mt="auto" color="gray.600" mb={2} flexGrow={1}>
        {labels[stat]}
      </Text>
      <Text fontSize="4xl" fontWeight="normal" lineHeight={1}>
        <Skeleton isLoaded={!!data}>{data ? data?.[stat] : '…'}</Skeleton>
      </Text>
    </Stack>
  );
};

export default PlayerStat;

import type { NextPage } from 'next';
import { Box, Center, HStack, SimpleGrid } from '@chakra-ui/react';
import PlayerAvatar from '@/components/PlayerAvatar';
import PlayerLink from '@/components/PlayerLink/PlayerLink';
import fetcher from '@/lib/fetcher';
import useSWRInfinite from 'swr/infinite';
import { PlayerAPIResponse } from './api/players';
import LoadingIcon from '@/components/LoadingIcon';

const getKey = (pageIndex: number, previousPageData: PlayerAPIResponse) => {
  if (previousPageData && !previousPageData.nextCursor) return null; // reached the end
  const appendCursor = pageIndex > 0 ? `?cursor=${previousPageData.nextCursor}` : '';
  return `/api/players${appendCursor}`; // SWR key
};

const Home: NextPage = () => {
  const { data, size, setSize, error } = useSWRInfinite<PlayerAPIResponse>(getKey, fetcher);
  const hasNextPage = data?.[data.length - 1].nextCursor;

  if (error) return <div>Error loading players</div>;

  if (!data)
    return (
      <Center p={8}>
        <LoadingIcon color="gray.300" size={8} />
      </Center>
    );

  return (
    <Box py={8}>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
        {data.map(page =>
          page.players?.map(user => (
            <HStack key={user.id}>
              <PlayerAvatar name={user.name} photo={user.image} />
              <PlayerLink name={user.name} id={user.id} />
            </HStack>
          ))
        )}
      </SimpleGrid>
    </Box>
  );
};

export default Home;

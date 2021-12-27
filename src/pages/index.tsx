import prisma from '@/lib/prisma';
import type { GetStaticProps, NextPage } from 'next';
import { Box, Center, Heading, HStack, SimpleGrid, Stack } from '@chakra-ui/react';
import PlayerAvatar from '@/components/PlayerAvatar';
import PlayerLink from '@/components/PlayerLink/PlayerLink';
import fetcher from '@/lib/fetcher';
import useSWRInfinite from 'swr/infinite';
import { PlayerAPIResponse } from './api/players';
import LoadingIcon from '@/components/LoadingIcon';
import { PromiseElement } from '@/lib/types/utils';
import Link from 'next/link';

const getKey = (pageIndex: number, previousPageData: PlayerAPIResponse) => {
  if (previousPageData && !previousPageData.nextCursor) return null; // reached the end
  const appendCursor = pageIndex > 0 ? `?cursor=${previousPageData.nextCursor}` : '';
  return `/api/players${appendCursor}`; // SWR key
};

type HomeProps = {
  offices: PromiseElement<ReturnType<typeof getOffices>>;
};

const getOffices = () => prisma.office.findMany();

const Home: NextPage<HomeProps> = ({ offices }) => {
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
      <Heading as="h2">Offices</Heading>
      <Stack>
        {offices?.map(office => (
          <Link key={office.slug} href={`/${office.slug}`} passHref>
            <Box as="a">{office.name}</Box>
          </Link>
        ))}
      </Stack>
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

export const getStaticProps: GetStaticProps = async () => {
  const offices = await getOffices();
  return {
    props: { offices },
    revalidate: 60 * 60 * 24,
  };
};

export default Home;

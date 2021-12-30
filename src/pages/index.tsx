import prisma from '@/lib/prisma';
import type { GetStaticProps, NextPage } from 'next';
import { Box, Center, Heading, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import PlayerAvatar from '@/components/PlayerAvatar';
import fetcher from '@/lib/fetcher';
import { PlayerAPIResponse } from './api/players';
import LoadingIcon from '@/components/LoadingIcon';
import { PromiseElement } from '@/lib/types/utils';
import Link from 'next/link';
import LatestMatches from '@/components/LatestMatches/LatestMatches';
import useSWR from 'swr';
import SEO from '@/components/SEO';

type HomeProps = {
  offices: PromiseElement<ReturnType<typeof getOffices>>;
};

const getOffices = () =>
  prisma.office.findMany({
    orderBy: { name: 'asc' },
    select: { name: true, icon: true, slug: true, games: { select: { id: true } } },
  });

const Home: NextPage<HomeProps> = ({ offices }) => {
  const { data, error } = useSWR<PlayerAPIResponse>(`/api/players?take=6`, fetcher, {
    revalidateOnFocus: false,
  });

  if (error) return <div>Error loading players</div>;

  return (
    <Box>
      <SEO />
      <SimpleGrid minH="80vh" columns={{ md: 2, lg: 3 }} gap={8} alignItems="center">
        <Box gridColumn={{ lg: 'span 2' }}>
          <Heading
            as="h1"
            fontSize={{ base: '4rem', md: '6rem' }}
            lineHeight="1"
            letterSpacing="tight"
            color="gray.400"
            mb={4}
          >
            work hard,
            <br />
            <Text as="span" bg="linear-gradient(-135deg, #FBB826, #FE33A1)" backgroundClip="text">
              play hard.
            </Text>
          </Heading>
          <Text color="gray.700" maxW="44ch">
            Get your personal OKRs ready: SaltPlay (pun very intended) enables you to brag over your office games
            performance. <br />A way more interesting way to{' '}
            <Text as="span" whiteSpace="nowrap">
              1-on-1
            </Text>
            .
          </Text>
        </Box>

        <Box>
          <LatestMatches perPage={4} canLoadMore={false} />
        </Box>
      </SimpleGrid>

      <Box as="section" py={16}>
        <Heading as="h2" mb={8}>
          Join heaps of{' '}
          <Text as="span" textDecoration="line-through">
            unproductive
          </Text>{' '}
          amazing people
        </Heading>
        <HStack justify="center" py={2} gap={8} w="100%" overflow="hidden">
          {data ? (
            data?.players?.map(user => <PlayerAvatar key={user.id} size={16} name={user.name} photo={user.image} />)
          ) : (
            <Center p={8}>
              <LoadingIcon color="gray.300" size={8} />
            </Center>
          )}
        </HStack>
      </Box>

      <Box py={8}>
        <Heading as="h2" mb={16}>
          Play games at our offices in
        </Heading>

        <SimpleGrid columns={{ md: 2, lg: 3 }} gap={8}>
          {offices?.map(office => (
            <Link key={office.slug} href={`/${office.slug}`} passHref>
              <Box p={8} as="a" bg="white" borderRadius="xl">
                <Text fontWeight="bold">
                  {office.icon} {office.name}
                </Text>
                <Text color="gray.500">
                  {office.games.length} game{office.games.length !== 1 ? 's' : ''}
                </Text>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      </Box>
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

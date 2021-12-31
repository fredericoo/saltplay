import prisma from '@/lib/prisma';
import type { GetStaticProps, NextPage } from 'next';
import { Badge, Box, Button, Circle, Grid, Heading, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import PlayerAvatar from '@/components/PlayerAvatar';
import { PromiseElement } from '@/lib/types/utils';
import Link from 'next/link';
import LatestMatches from '@/components/LatestMatches';
import SEO from '@/components/SEO';

type HomeProps = {
  offices: PromiseElement<ReturnType<typeof getOffices>>;
  players: PromiseElement<ReturnType<typeof getPlayerSample>>;
  playerCount: number;
};

const Home: NextPage<HomeProps> = ({ offices, players, playerCount }) => {
  const otherPlayersCount = playerCount - players.length;
  const displayOtherPlayersCount =
    otherPlayersCount > 1000 ? `${Math.floor(otherPlayersCount / 1000)}k` : otherPlayersCount;

  return (
    <Box>
      <SEO />
      <SimpleGrid minH="80vh" columns={{ md: 2, lg: 3 }} gap={8} alignItems="center">
        <Box py={16} gridColumn={{ lg: 'span 2' }}>
          <Heading
            as="h1"
            fontSize={{ base: '4rem', md: '6rem' }}
            lineHeight="1"
            letterSpacing="tight"
            color="gray.400"
            mb={8}
          >
            work hard,
            <br />
            <Text as="span" bg="linear-gradient(-135deg, #FBB826, #FE33A1)" backgroundClip="text">
              play hard.
            </Text>
          </Heading>
          <Text color="gray.600" maxW="44ch" mb={4}>
            Get your personal OKRs ready: SaltPlay (pun very intended) enables you to brag over your office games
            performance. <br />A way more interesting way to{' '}
            <Text as="span" whiteSpace="nowrap">
              1-on-1
            </Text>
            .
          </Text>
          <Button as="a" href="#offices" variant="primary">
            Find games in my office
          </Button>
        </Box>

        <Box>
          <LatestMatches perPage={4} canLoadMore={false} />
        </Box>
      </SimpleGrid>

      <Box as="section" py={4} bg="white" px={4} borderRadius="xl">
        <Heading as="h2" mb={8} textAlign="center" color="gray.600" fontSize="2xl">
          join heaps of{' '}
          <Text as="span" textDecoration="line-through">
            unproductive
          </Text>{' '}
          amazing people
        </Heading>
        <HStack justify="center" py={2} spacing="-2" w="100%" overflow="hidden">
          {players?.map(user => (
            <Box key={user.id} _hover={{ pr: 6 }} transition={'.6s cubic-bezier(0.16, 1, 0.3, 1)'}>
              <PlayerAvatar size={16} user={user} isLink />
            </Box>
          ))}
          {otherPlayersCount > 0 && (
            <Circle boxShadow="0 0 0 3px white" h="16" w="16" bg="gray.300" color="gray.600" overflow="hidden">
              <Text fontSize="1em" fontWeight="bold" textAlign="center" noOfLines={1}>
                +{displayOtherPlayersCount}
              </Text>
            </Circle>
          )}
        </HStack>
      </Box>

      <SimpleGrid columns={{ md: 3 }} gap={8} py={8} pt={16} as="section" id="offices" alignItems="start">
        <Heading as="h2" fontSize="6xl" color="gray.400">
          play games at our offices in
        </Heading>

        <SimpleGrid columns={{ md: 2 }} gridColumn={{ md: 'span 2' }} gap={4}>
          {offices
            // ?.filter(office => office.games.length)
            ?.map(office => (
              <Link key={office.slug} href={`/${office.slug}`} passHref>
                <HStack p={4} as="a" bg="white" borderRadius="xl" _hover={{ bg: 'gray.200' }}>
                  <Box w="1.5em" h="1.5em" bg="white" borderRadius="lg" lineHeight={'1.5em'} textAlign="center">
                    {office.icon}
                  </Box>
                  <Text fontWeight="bold" flexGrow={1}>
                    {office.name}
                  </Text>
                  <Badge letterSpacing="wide" color="gray.500">
                    {office.games.length} game{office.games.length !== 1 ? 's' : ''}
                  </Badge>
                </HStack>
              </Link>
            ))}
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
};

const getOffices = () =>
  prisma.office.findMany({
    orderBy: { name: 'asc' },
    select: { name: true, icon: true, slug: true, games: { select: { id: true } } },
  });

const getPlayerSample = () =>
  prisma.user.findMany({
    orderBy: { scores: { _count: 'desc' } },
    take: 10,
    select: { id: true, name: true, image: true },
  });

const getPlayerCount = () => prisma.user.count();

export const getStaticProps: GetStaticProps = async () => {
  const offices = await getOffices();
  const players = await getPlayerSample();
  const playerCount = await getPlayerCount();

  return {
    props: { offices, players, playerCount },
    revalidate: 60 * 60 * 24,
  };
};

export default Home;

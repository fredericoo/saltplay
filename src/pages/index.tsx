import prisma from '@/lib/prisma';
import type { GetStaticProps, NextPage } from 'next';
import { Badge, Box, Heading, HStack, SimpleGrid, Text } from '@chakra-ui/react';
import PlayerAvatar from '@/components/PlayerAvatar';
import { PromiseElement } from '@/lib/types/utils';
import Link from 'next/link';
import LatestMatches from '@/components/LatestMatches';
import SEO from '@/components/SEO';
import { User } from '@prisma/client';
import { memo } from 'react';
import { motion } from 'framer-motion';

type HomeProps = {
  offices: PromiseElement<ReturnType<typeof getOffices>>;
  players: PromiseElement<ReturnType<typeof getPlayerSample>>;
};

const Home: NextPage<HomeProps> = ({ offices, players }) => {
  return (
    <Box>
      <SEO />
      <SimpleGrid minH="80vh" columns={{ md: 2 }} gap={8} alignItems="center">
        <Box py={8}>
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
        </Box>

        <Box pb={16}>
          <SimpleGrid columns={{ lg: 2 }} gap={4}>
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
        </Box>
      </SimpleGrid>

      <Box
        as="section"
        py={4}
        bg="linear-gradient(to top, rgb(251, 184, 38, 0.3), var(--chakra-colors-gray-300) )"
        px={4}
        borderRadius="xl"
        position="relative"
        overflow="hidden"
      >
        <Box position="absolute" zIndex={0} inset={0} transform="rotate(-15deg)">
          <MemoPlayersDeco players={players} />
        </Box>
        <Box zIndex={1} position="relative">
          <Heading as="h2" mb={8} textAlign="center" color="gray.600" fontSize="2xl">
            join heaps of{' '}
            <Text as="span" textDecoration="line-through">
              unproductive
            </Text>{' '}
            great players
          </Heading>
          <Box mb="-64px" maxW="container.sm" mx="auto">
            <LatestMatches perPage={3} canLoadMore={false} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const MotionBox = motion(Box);
const PlayersDeco: React.VFC<{ players: Pick<User, 'id' | 'image' | 'name'>[] }> = ({ players }) => {
  return (
    <>
      {players?.map((user, i) => {
        const random = Math.random();
        return (
          <MotionBox
            zIndex={0}
            initial={{ translateY: 1000 }}
            animate={{ translateY: -1000 }}
            transition={{ repeat: Infinity, duration: random * -6 + 12 }}
            pointerEvents={'none'}
            key={user.id}
            position="relative"
            left={Math.random() * 100 + '%'}
            bottom={0}
            filter={`blur(${random * 4}px)`}
            transform={`scale(${random * 1 + 0.5})`}
          >
            <PlayerAvatar size={16} user={user} />
          </MotionBox>
        );
      })}
    </>
  );
};
const MemoPlayersDeco = memo(PlayersDeco);

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

export const getStaticProps: GetStaticProps = async () => {
  const offices = await getOffices();
  const players = await getPlayerSample();

  return {
    props: { offices, players },
    revalidate: 60 * 60 * 24,
  };
};

export default Home;

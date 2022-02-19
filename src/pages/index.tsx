import LatestMatches from '@/components/LatestMatches';
import PlayerAvatar from '@/components/PlayerAvatar';
import SEO from '@/components/SEO';
import prisma from '@/lib/prisma';
import { PromiseElement } from '@/lib/types/utils';
import { Badge, Box, Button, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { motion } from 'framer-motion';
import type { GetStaticProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { memo } from 'react';

type HomeProps = {
  offices: PromiseElement<ReturnType<typeof getOffices>>;
  players: PromiseElement<ReturnType<typeof getPlayerSample>>;
};

const Home: NextPage<HomeProps> = ({ offices, players }) => {
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const officesWithGames = offices?.filter(office => office.games.length) || [];
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
            <Text
              as="span"
              bg={[
                // @ts-ignore chakra doesn't offer array as props as Emotion does, but it works!
                [
                  'linear-gradient(-135deg, #FBB826, #FE33A1)',
                  'linear-gradient(-135deg, color(display-p3 1 0.638 0), color(display-p3 1 0 0.574))',
                ],
              ]}
              backgroundClip="text"
            >
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
          <SimpleGrid columns={{ lg: officesWithGames.length > 4 ? 2 : 1 }} gap={4}>
            {officesWithGames.map(office => (
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

      <Box as="section" py={4} bg="gray.200" px={4} borderRadius="xl" position="relative" overflow="hidden">
        <Box
          h="100%"
          w="100%"
          top="0"
          left="0"
          position="absolute"
          bg="linear-gradient(to bottom, rgb(226, 232, 240, 0) 75%, rgb(226, 232, 240, 1))"
          zIndex="2"
        />
        <Box position="absolute" zIndex={0} inset={0} transform="rotate(-15deg)">
          <MemoPlayersDeco players={players} />
        </Box>
        <Box zIndex={1} position="relative">
          <Heading as="h2" mb={12} mt={4} textAlign="center" color="gray.600" fontSize="4xl">
            join{' '}
            <Text
              as="span"
              bg={[
                // @ts-ignore chakra doesn't offer array as props as Emotion does, but it works!
                [
                  'linear-gradient(-135deg, #FBB826 25%, #FE33A1)',
                  'linear-gradient(-135deg, color(display-p3 1 0.638 0) 25%, color(display-p3 1 0 0.574))',
                ],
              ]}
              backgroundClip="text"
            >
              heaps
            </Text>{' '}
            of{' '}
            <Text
              as="span"
              display="inline-block"
              position="relative"
              _before={{
                content: `""`,
                position: 'absolute',
                w: '100%',
                h: '.08em',
                bg: [
                  [
                    'linear-gradient(-135deg, #FBB826, #FE33A1)',
                    'linear-gradient(-135deg, color(display-p3 1 0.638 0), color(display-p3 1 0 0.574))',
                  ],
                ],
                top: '58%',
                left: 0,
              }}
            >
              unproductive
            </Text>{' '}
            great players
          </Heading>
          <Box h="400px" overflow="hidden" maxW="container.sm" mx="auto" pt={8}>
            <LatestMatches canLoadMore={false} />
          </Box>
        </Box>
      </Box>
      <VStack transform="translateY(-50%)" position="relative" zIndex="2">
        <Link href="/api/auth/signin" passHref>
          <Button isDisabled={isLoggedIn} as="a" variant={isLoggedIn ? 'subtle' : 'primary'} size="lg" m={3}>
            {isLoggedIn ? "You're logged in!" : 'Sign in with Slack'}
          </Button>
        </Link>
      </VStack>
    </Box>
  );
};

const MotionBox = motion(Box);
const PlayersDeco: React.VFC<{ players: Pick<User, 'id' | 'image' | 'name' | 'roleId'>[] }> = ({ players }) => {
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
    select: { id: true, name: true, image: true, roleId: true },
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

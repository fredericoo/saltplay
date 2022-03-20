import LatestMatches from '@/components/LatestMatches';
import Leaderboard from '@/components/Leaderboard';
import List from '@/components/List';
import ListItem from '@/components/ListItem';
import PlayerAvatar from '@/components/PlayerAvatar';
import SEO from '@/components/SEO';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { gradientProps } from '@/lib/styleUtils';
import { PromiseElement } from '@/lib/types/utils';
import { Box, Button, Container, Heading, SimpleGrid, styled, Text, VStack } from '@chakra-ui/react';
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

const Section = styled(Box, {
  baseStyle: {
    py: 4,
    bg: 'grey.4',
    px: 4,
    borderRadius: 'xl',
    position: 'relative',
    overflow: 'hidden',
  },
});
Section.defaultProps = { as: 'section' };

const Home: NextPage<HomeProps> = ({ offices, players }) => {
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const officesWithGames = offices?.filter(office => office.games.length) || [];
  useNavigationState('Offices');

  return (
    <Box>
      <SEO />
      <Container maxW="container.xl" px={{ md: 8 }} position={{ md: 'sticky' }} top="0" zIndex="0">
        <SimpleGrid mx="auto" columns={{ md: 2 }} gap={8} alignItems="center">
          <Box pt={32} pb={16}>
            <Heading
              as="h1"
              fontSize={{ base: '4rem', md: '6rem' }}
              lineHeight="1"
              letterSpacing="tight"
              color="grey.11"
              mb={8}
            >
              work hard,
              <br />
              <Text as="span" bg={gradientProps} backgroundClip="text">
                play hard.
              </Text>
            </Heading>
            <Text color="grey.11" maxW="44ch" mb={4}>
              Get your personal OKRs ready: SaltPlay (pun very intended) enables you to brag over your office games
              performance. <br />A way more interesting way to{' '}
              <Text as="span" whiteSpace="nowrap">
                1-on-1
              </Text>
              .
            </Text>
          </Box>

          <Box py={8}>
            <Heading as="h2" mb={4} fontSize="md" color="grey.10" pl={14}>
              Explore games in
            </Heading>
            <List columns={officesWithGames.length > 4 ? 2 : 1}>
              {officesWithGames.map(office => (
                <ListItem
                  key={office.slug}
                  href={`/${office.slug}`}
                  icon={office.icon ?? undefined}
                  badge={`${office.games.length} game${office.games.length !== 1 ? 's' : ''}`}
                >
                  {office.name}
                </ListItem>
              ))}
            </List>
          </Box>
        </SimpleGrid>
      </Container>

      <Container bg="grey.2" position="relative" maxW="container.xl">
        <SimpleGrid columns={{ md: 2 }} gap={4}>
          <Section p={0} pb="100%" w="100%" h="500px" bg="primary.4">
            <Heading as="h2" color="grey.11" fontSize="2xl" p={8} zIndex="1" position="relative">
              Climb up the leaderboards
            </Heading>
            <Box left="25%" position="absolute" w="100%" zIndex="0">
              <Leaderboard gameId={officesWithGames[1].games[0].id} />
            </Box>
          </Section>
          <Section>
            <Heading as="h2" color="grey.11" fontSize="2xl" p={4}>
              Register any match in less than 30 seconds
            </Heading>
          </Section>
          <Section gridColumn="1/-1">
            <Box
              h="100%"
              w="100%"
              top="0"
              left="0"
              position="absolute"
              bg="grey.4"
              zIndex="2"
              pointerEvents="none"
              sx={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 75%, rgba(0,0,0,1))' }}
            />
            <Box position="absolute" zIndex={0} inset={0} transform="rotate(-15deg)">
              <MemoPlayersDeco players={players} />
            </Box>
            <Box zIndex={1} position="relative">
              <Heading as="h2" mb={12} mt={4} textAlign="center" color="grey.10" fontSize="4xl">
                join{' '}
                <Text as="span" color="primary.9">
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
                    bg: 'primary.9',
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
          </Section>
          {!isLoggedIn && (
            <VStack transform="translateY(-50%)" mt={-4} position="relative" zIndex="2" gridColumn="1/-1">
              <Link href="/api/auth/signin" passHref>
                <Button as="a" variant="primary" size="lg" m={3}>
                  {'Sign in with Slack'}
                </Button>
              </Link>
            </VStack>
          )}
        </SimpleGrid>
      </Container>
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

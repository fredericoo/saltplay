import FloatingActionButton from '@/components/FloatingActionButton';
import LatestMatches from '@/components/LatestMatches';
import Medal from '@/components/Medal';
import { MotionBox } from '@/components/Motion';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import PlayerAvatar from '@/components/PlayerAvatar';
import PlayerName from '@/components/PlayerName';
import SEO from '@/components/SEO';
import Stat from '@/components/Stat';
import { UserPATCHAPIResponse } from '@/lib/api/handlers/user/patchUserHandler';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import { getPlayerName } from '@/lib/players';
import prisma from '@/lib/prisma';
import { canViewDashboard, getRoleStyles } from '@/lib/roles';
import getGradientFromId from '@/theme/palettes';
import {
  Badge,
  Box,
  Container,
  Heading,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { Game, User } from '@prisma/client';
import axios from 'axios';
import { AnimateSharedLayout } from 'framer-motion';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { VscEdit } from 'react-icons/vsc';

const getPlayerById = async (id: User['id']) =>
  await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      roleId: true,
      boastId: true,
      medals: {
        select: {
          id: true,
          seasonid: true,
        },
      },
      leftmatches: { select: { leftscore: true, rightscore: true } },
      rightmatches: { select: { leftscore: true, rightscore: true } },
      scores: {
        distinct: 'gameid',
        select: {
          game: {
            select: {
              id: true,
              name: true,
              icon: true,
              office: {
                select: { icon: true },
              },
            },
          },
        },
      },
    },
  });

type PlayerPageProps = {
  player: Omit<NonNullable<Awaited<ReturnType<typeof getPlayerById>>>, 'leftmatches' | 'rightmatches' | 'scores'>;
  stats: {
    played: number;
    won: number;
    lost: number;
    games: Pick<Game, 'id' | 'name' | 'icon'>[];
  };
};

const PlayerPage: NextPage<PlayerPageProps> = ({ player, stats }) => {
  useNavigationState(getPlayerName(player?.name, 'initial') || 'Profile');
  const { data: session } = useSession();
  const [newBoastId, setBoastId] = useState(player?.boastId);
  const boastId = newBoastId || player?.boastId;

  const isMe = player.id === session?.user.id;

  if (!player) return null;

  const handleBoast = async (medalId: string) => {
    const body = { boastId: medalId };
    setBoastId(medalId);
    try {
      const res = await axios.patch<UserPATCHAPIResponse>(`/api/users/${player.id}`, body).then(res => res.data);
      if (!res.data?.boastId) throw new Error('No badge to boast.');
    } catch (e) {
      setBoastId(null);
      console.error(e);
    }
  };

  const playerName = player.name || `Anonymous`;
  const hasMultipleGames = stats.games.length > 1;

  const boastMedal = player.medals?.find(medal => medal.id === boastId);
  const otherMedals = player.medals?.filter(medal => medal.id !== boastId);

  return (
    <Container maxW="container.sm" pt={NAVBAR_HEIGHT}>
      <SEO title={`${playerName}’s profile`} />
      {canViewDashboard(session?.user.roleId) && (
        <FloatingActionButton
          buttons={[{ label: 'edit', icon: <VscEdit />, colorScheme: 'success', href: `/admin/users/${player.id}` }]}
        />
      )}
      <AnimateSharedLayout>
        <Stack spacing={{ base: 1, md: 0.5 }}>
          <Box bg="grey.1" borderRadius="18" overflow="hidden">
            <Box bg={getGradientFromId(player.id)} h="32" />
            <Box p={4} mt="-16">
              <PlayerAvatar user={player} size={32} />

              <HStack>
                <Heading as="h1" sx={getRoleStyles(player.roleId)} mt={2} size="lg">
                  <PlayerName user={player} />
                </Heading>
                {boastMedal?.id && boastMedal.seasonid && (
                  <MotionBox layoutId={boastMedal.id} key={boastMedal.id}>
                    <Medal id={boastMedal.id} seasonId={boastMedal.seasonid} />
                  </MotionBox>
                )}
              </HStack>
            </Box>
            {otherMedals.length > 0 && (
              <Box p={1} pb={0} userSelect="none">
                <Stack px={4} py={4} bg="grey.2" borderRadius="xl">
                  <Text fontSize="md" color="grey.9" mb={2}>
                    Badges{' '}
                    <Badge colorScheme="primary" variant="solid">
                      New!
                    </Badge>
                  </Text>
                  <HStack as="section" flexWrap="wrap">
                    {otherMedals.map(
                      medal =>
                        medal.seasonid && (
                          <MotionBox layoutId={medal.id} key={medal.id} onClick={() => isMe && handleBoast(medal.id)}>
                            <Medal id={medal.id} seasonId={medal.seasonid} />
                          </MotionBox>
                        )
                    )}
                  </HStack>
                  {isMe && (
                    <Text fontSize="sm" color="grey.11">
                      Tap on a badge to show it off to your friends!
                    </Text>
                  )}
                </Stack>
              </Box>
            )}
            <HStack p="1" flexWrap={'wrap'} spacing={{ base: 1, md: 0.5 }} alignItems="stretch">
              <Stat label="Played" content={stats.played} />
              <Stat label="Won" content={stats.won} />
              <Stat label="Lost" content={stats.lost} />
            </HStack>
          </Box>

          <Stack spacing={6} pt={4}>
            <Tabs isLazy key={player.id}>
              <TabList>
                {hasMultipleGames && <Tab>All</Tab>}
                {stats.games.map(game => (
                  <Tab key={game.id}>
                    {game.icon} {game.name}
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                {hasMultipleGames && (
                  <TabPanel pt={8}>
                    <LatestMatches userId={player.id} />
                  </TabPanel>
                )}
                {stats.games.map(game => (
                  <TabPanel pt={8} key={game.id}>
                    <LatestMatches userId={player.id} gameId={game.id} />
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Stack>
        </Stack>
      </AnimateSharedLayout>
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Deliberately not statically building users.
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<PlayerPageProps> = async ({ params }) => {
  if (typeof params?.id !== 'string') {
    return { notFound: true };
  }

  const fullPlayer = await getPlayerById(params?.id);
  if (!fullPlayer) return { notFound: true };

  const { leftmatches, rightmatches, scores, ...player } = fullPlayer;

  const played = leftmatches.length + rightmatches.length;
  const won =
    leftmatches.reduce((acc, match) => (match.leftscore > match.rightscore ? acc + 1 : acc), 0) +
    rightmatches.reduce((acc, match) => (match.rightscore > match.rightscore ? acc + 1 : acc), 0);
  const lost =
    leftmatches.reduce((acc, match) => (match.leftscore < match.rightscore ? acc + 1 : acc), 0) +
    rightmatches.reduce((acc, match) => (match.rightscore < match.rightscore ? acc + 1 : acc), 0);

  const games = scores.map(score => score.game);

  return {
    props: {
      player,
      stats: {
        played,
        won,
        lost,
        games: games.map(game => ({ name: game.name, icon: [game.office.icon, game.icon].join(' '), id: game.id })),
      },
    },
    revalidate: 60,
  };
};

export default PlayerPage;

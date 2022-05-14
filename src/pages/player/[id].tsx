import FloatingActionButton from '@/components/FloatingActionButton';
import LatestMatches from '@/components/LatestMatches';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import PlayerAvatar from '@/components/PlayerAvatar';
import PlayerName from '@/components/PlayerName';
import SEO from '@/components/SEO';
import Stat from '@/components/Stat';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import { getPlayerName } from '@/lib/players';
import prisma from '@/lib/prisma';
import { canViewDashboard, getRoleStyles } from '@/lib/roles';
import getGradientFromId from '@/theme/palettes';
import { Box, Container, HStack, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { Game, User } from '@prisma/client';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { VscEdit } from 'react-icons/vsc';

const getPlayerById = async (id: User['id']) =>
  await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      roleId: true,
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
  player: Pick<User, 'id' | 'name' | 'image' | 'roleId'>;
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

  if (!player) return null;

  const playerName = player.name || `Anonymous`;
  const hasMultipleGames = stats.games.length > 1;
  return (
    <Container maxW="container.sm" pt={NAVBAR_HEIGHT}>
      <SEO title={`${playerName}’s profile`} />
      {canViewDashboard(session?.user.roleId) && (
        <FloatingActionButton
          buttons={[{ label: 'edit', icon: <VscEdit />, colorScheme: 'success', href: `/admin/users/${player.id}` }]}
        />
      )}
      <Stack spacing={{ base: 1, md: 0.5 }}>
        <Box bg="grey.1" borderRadius="18" overflow="hidden">
          <Box bg={getGradientFromId(player.id)} h="32" />
          <Box p={4} mt="-16">
            <PlayerAvatar user={player} size={32} />

            <Text
              {...getRoleStyles(player.roleId)}
              as="h1"
              lineHeight={1.2}
              fontSize="3xl"
              letterSpacing="tight"
              mt={2}
              overflow="hidden"
            >
              <PlayerName user={player} />
            </Text>
          </Box>
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

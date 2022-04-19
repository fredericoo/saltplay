import LatestMatches from '@/components/LatestMatches';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import PlayerAvatar from '@/components/PlayerAvatar';
import PlayerStat from '@/components/PlayerStat';
import SEO from '@/components/SEO';
import fetcher from '@/lib/fetcher';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import { getPlayerName } from '@/lib/players';
import prisma from '@/lib/prisma';
import { getRoleStyles } from '@/lib/roles';
import getGradientFromId from '@/theme/palettes';
import { Box, Container, HStack, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import useSWR from 'swr';
import { PlayerStatsAPIResponse } from '../api/players/[id]/stats';

export const getPlayerById = async (id: User['id']) =>
  await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, image: true, roleId: true },
  });

type PlayerPageProps = {
  player?: Awaited<ReturnType<typeof getPlayerById>>;
};

const PlayerPage: NextPage<PlayerPageProps> = ({ player }) => {
  const { data } = useSWR<PlayerStatsAPIResponse>(player?.id ? `/api/players/${player.id}/stats` : null, fetcher, {
    revalidateOnFocus: false,
  });
  useNavigationState(getPlayerName(player?.name, 'initial') || 'Profile');

  if (!player) return null;

  const playerName = player.name || `Player ${player?.id}`;
  const hasMultipleGames = !!data?.data?.games?.length && data.data.games.length > 1;
  return (
    <Container maxW="container.sm" pt={NAVBAR_HEIGHT}>
      <Stack spacing={{ base: 1, md: 0.5 }}>
        <SEO title={`${playerName}’s profile`} />
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
              {playerName}
            </Text>
          </Box>
          <HStack p="1" flexWrap={'wrap'} spacing={{ base: 1, md: 0.5 }} alignItems="stretch">
            <PlayerStat id={player.id} stat="played" />
            <PlayerStat id={player.id} stat="won" />
            <PlayerStat id={player.id} stat="lost" />
          </HStack>
        </Box>

        <Stack spacing={6} pt={4}>
          <Tabs isLazy key={player.id}>
            <TabList>
              {hasMultipleGames && <Tab>All</Tab>}
              {data?.data?.games?.map(game => (
                <Tab key={game.id}>{game.name}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {hasMultipleGames && (
                <TabPanel pt={8}>
                  <LatestMatches userId={player.id} />
                </TabPanel>
              )}
              {data?.data?.games?.map(game => (
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

export const getServerSideProps: GetServerSideProps<PlayerPageProps> = async ({ params }) => {
  if (typeof params?.id !== 'string') {
    return { props: {} };
  }

  const player = await getPlayerById(params?.id);

  if (!player) {
    return { props: {} };
  }

  return {
    props: {
      player,
    },
  };
};

export default PlayerPage;

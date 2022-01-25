import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import { PromiseElement } from '@/lib/types/utils';
import { Box, HStack, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import SEO from '@/components/SEO';
import LatestMatches from '@/components/LatestMatches';
import PlayerStat from '@/components/PlayerStat';
import PlayerAvatar from '@/components/PlayerAvatar';
import fetcher from '@/lib/fetcher';
import useSWR from 'swr';
import { PlayerStatsAPIResponse } from '../api/players/[id]/stats';
import getUserGradient from '@/theme/palettes';

export const getPlayerById = async (id: User['id']) =>
  await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, image: true },
  });

type PlayerPageProps = {
  player?: PromiseElement<ReturnType<typeof getPlayerById>>;
};

const PlayerPage: NextPage<PlayerPageProps> = ({ player }) => {
  const { data, error } = useSWR<PlayerStatsAPIResponse>(
    player?.id ? `/api/players/${player.id}/stats` : null,
    fetcher
  );

  if (!player) return null;

  const playerName = player.name || `Player ${player?.id}`;
  return (
    <Stack spacing={{ base: 1, md: 0.5 }} maxW="container.sm" mx="auto">
      <SEO title={`${playerName}’s profile`} />
      <Box bg="gray.50" borderRadius="xl" overflow="hidden">
        <Box bg={getUserGradient(player.id)} h="32" />
        <Box p={4} mt="-16">
          <PlayerAvatar user={player} size={32} />
          <Text as="h1" fontSize={'2rem'} letterSpacing="tight" mt={2} overflow="hidden">
            {playerName}
          </Text>
          <HStack spacing={2}>
            {data?.games?.map(game => (
              <Box
                fontSize="sm"
                letterSpacing="wide"
                bg="gray.100"
                color="gray.600"
                borderRadius="8"
                px={2}
                py={1}
                key={game}
              >
                {game}
              </Box>
            ))}
          </HStack>
        </Box>
      </Box>
      <HStack flexWrap={'wrap'} spacing={{ base: 1, md: 0.5 }} alignItems="stretch">
        <PlayerStat id={player.id} stat="played" />
        <PlayerStat id={player.id} stat="won" />
        <PlayerStat id={player.id} stat="lost" />
      </HStack>
      <Stack spacing={6} pt={4}>
        <Tabs>
          <TabList mb={8}>
            <Tab>Latest Matches</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LatestMatches userId={player.id} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Stack>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const players = await prisma.user.findMany({ select: { id: true } });
  return {
    paths: players.map(player => ({ params: { id: player.id } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PlayerPageProps> = async ({ params }) => {
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
    revalidate: 60 * 60 * 24,
  };
};

export default PlayerPage;

import LatestMatches from '@/components/LatestMatches';
import PlayerAvatar from '@/components/PlayerAvatar';
import PlayerStat from '@/components/PlayerStat';
import SEO from '@/components/SEO';
import fetcher from '@/lib/fetcher';
import prisma from '@/lib/prisma';
import { getRoleStyles } from '@/lib/roles';
import { PromiseElement } from '@/lib/types/utils';
import getGradientFromId from '@/theme/palettes';
import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import useSWR from 'swr';
import { PlayerStatsAPIResponse } from '../api/players/[id]/stats';

export const getPlayerById = async (id: User['id']) =>
  await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, image: true, roleId: true },
  });

type PlayerPageProps = {
  player?: PromiseElement<ReturnType<typeof getPlayerById>>;
};

const PlayerPage: NextPage<PlayerPageProps> = ({ player }) => {
  const { data } = useSWR<PlayerStatsAPIResponse>(player?.id ? `/api/players/${player.id}/stats` : null, fetcher);

  if (!player) return null;

  const playerName = player.name || `Player ${player?.id}`;
  return (
    <Stack spacing={{ base: 4, md: 8 }} maxW="container.sm" mx="auto">
      <SEO title={`${playerName}’s profile`} />
      <Box bg="white" borderRadius="xl" overflow="hidden">
        <Box bg={getGradientFromId(player.id)} h="32" />
        <Stack alignItems="flex-start" p={4} mt="-16">
          <PlayerAvatar user={player} size={32} />

          <Text
            {...getRoleStyles(player.roleId)}
            as="h1"
            fontSize={'2rem'}
            letterSpacing="tight"
            mt={2}
            overflow="hidden"
          >
            {playerName}
          </Text>
          <HStack spacing={2}>
            {data?.games?.map(game => (
              <Box
                fontSize="sm"
                letterSpacing="wide"
                bg="gray.300"
                color="gray.800"
                p="1px"
                borderRadius="10"
                key={game}
              >
                <Box px={2} py={1} borderRadius="9" bg="white">
                  {game}
                </Box>
              </Box>
            ))}
          </HStack>
        </Stack>
      </Box>
      <HStack flexWrap={'wrap'} spacing={{ base: 4, md: 8 }}>
        <PlayerStat id={player.id} stat="played" />
        <PlayerStat id={player.id} stat="won" />
        <PlayerStat id={player.id} stat="lost" />
      </HStack>
      <Stack spacing={6} pt={4}>
        <Text as="h2" fontSize="md" color="gray.400" textAlign="center">
          Recent matches played
        </Text>
        <LatestMatches userId={player.id} />
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
    revalidate: 60 * 60,
  };
};

export default PlayerPage;

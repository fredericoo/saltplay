import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import { PromiseElement } from '@/lib/types/utils';
import { Box, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import SEO from '@/components/SEO';
import LatestMatches from '@/components/LatestMatches';
import PlayerStat from '@/components/PlayerStat/PlayerStat';
import PlayerAvatar from '@/components/PlayerAvatar';

export const getPlayerById = async (id: User['id']) =>
  await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, image: true },
  });

type PlayerPageProps = {
  player?: PromiseElement<ReturnType<typeof getPlayerById>>;
};

const colourPalettes = [
  ['#9682D9', '#CA8CEA', '#AFADF8'],
  ['#FDD6AD', '#B3F3D9', '#F7EFBD'],
  ['#F5887E', '#FE8EB4', '#FEC1AF'],
  ['#C79EFC', '#BBC8FF', '#FDBEF2'],
  ['#60D3CD', '#7FDDEF', '#9AF2C8'],
];

const PlayerPage: NextPage<PlayerPageProps> = ({ player }) => {
  if (!player) return null;
  const uniqueKey = player.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const nameColour = colourPalettes[uniqueKey % colourPalettes.length];

  const playerName = player.name || `Player ${player?.id}`;
  return (
    <Stack spacing={8} maxW="container.sm" mx="auto">
      <SEO title={`${playerName}’s profile`} />
      <Box bg="white" borderRadius="xl" overflow="hidden">
        <Box bg={`linear-gradient(135deg, ${nameColour.join(',')})`} h="32" />
        <Box p={4} mt="-16">
          <PlayerAvatar name={player.name} photo={player.image} size={32} />
          <Text as="h1" fontSize={'2rem'} letterSpacing="tight" mt={2} overflow="hidden" isTruncated>
            {playerName}
          </Text>
        </Box>
      </Box>
      <HStack flexWrap={'wrap'} spacing={8}>
        <PlayerStat id={player.id} stat="played" />
        <PlayerStat id={player.id} stat="won" />
        <PlayerStat id={player.id} stat="lost" />
      </HStack>
      <Stack spacing={6} pt={4}>
        <Heading as="h2" fontSize="md">
          Recent matches played
        </Heading>
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
    revalidate: 60 * 60 * 24,
  };
};

export default PlayerPage;

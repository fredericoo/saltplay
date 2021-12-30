import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import { PromiseElement } from '@/lib/types/utils';
import { Box, Heading, SimpleGrid, Stack } from '@chakra-ui/react';
import SEO from '@/components/SEO';
import LatestMatches from '@/components/LatestMatches';
import PlayerStat from '@/components/PlayerStat/PlayerStat';

export const getPlayerById = async (id: User['id']) =>
  await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, image: true },
  });

type PlayerPageProps = {
  player?: PromiseElement<ReturnType<typeof getPlayerById>>;
};

const PlayerPage: NextPage<PlayerPageProps> = ({ player }) => {
  if (!player) return null;
  const playerName = player.name || `Player ${player?.id}`;
  return (
    <Box>
      <SEO title={`${playerName}’s profile`} />
      <Heading as="h1" fontSize={{ base: '2rem', md: '4rem' }} letterSpacing="tight" mb={4}>
        {playerName}
      </Heading>
      <SimpleGrid columns={{ lg: 2 }} gap={8}>
        <LatestMatches userId={player.id} />
        <Stack spacing={8}>
          <PlayerStat id={player.id} stat="played" />
          <PlayerStat id={player.id} stat="won" />
          <PlayerStat id={player.id} stat="lost" />
        </Stack>
      </SimpleGrid>
    </Box>
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

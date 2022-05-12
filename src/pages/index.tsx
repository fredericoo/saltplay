import AddMatchBlock from '@/components/home/AddMatchBlock';
import Hero from '@/components/home/Hero';
import LeaderboardBlock from '@/components/home/LeaderboardBlock';
import PlayersBlock from '@/components/home/PlayersBlock';
import SEO from '@/components/SEO';
import { HOME_CACHE_HEADER } from '@/constants';
import { getMostRecentGameId, getOffices, getPlayerSample } from '@/lib/home';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import { Box, Container, SimpleGrid } from '@chakra-ui/react';
import type { GetServerSideProps, NextPage } from 'next';

type HomeProps = {
  offices: Awaited<ReturnType<typeof getOffices>>;
  players: Awaited<ReturnType<typeof getPlayerSample>>;
  mostRecentGameId: Awaited<ReturnType<typeof getMostRecentGameId>>;
};

const Home: NextPage<HomeProps> = ({ offices, players, mostRecentGameId }) => {
  useNavigationState('Offices');

  return (
    <Box>
      <SEO />
      <Hero offices={offices} />
      <Container bg="grey.2" position="relative" maxW="container.xl">
        <SimpleGrid columns={{ md: 2 }} gap={4}>
          <LeaderboardBlock gameId={mostRecentGameId} />
          <AddMatchBlock players={players} />
          <PlayersBlock players={players} />
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const offices = await getOffices();
  const players = await getPlayerSample();
  const mostRecentGameId = await getMostRecentGameId();

  res.setHeader('Cache-Control', HOME_CACHE_HEADER);

  return {
    props: { offices, players, mostRecentGameId },
  };
};

export default Home;

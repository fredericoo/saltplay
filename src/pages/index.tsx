import AddMatchBlock from '@/components/home/AddMatchBlock';
import Hero from '@/components/home/Hero';
import LeaderboardBlock from '@/components/home/LeaderboardBlock';
import PlayersBlock from '@/components/home/PlayersBlock';
import SEO from '@/components/SEO';
import { getMostRecentGame, getOffices, getPlayerSample } from '@/lib/home';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import { Box, Container, SimpleGrid } from '@chakra-ui/react';
import type { GetStaticProps, NextPage } from 'next';

type HomeProps = {
  offices: Awaited<ReturnType<typeof getOffices>>;
  players: Awaited<ReturnType<typeof getPlayerSample>>;
  mostRecentGame: Awaited<ReturnType<typeof getMostRecentGame>>;
};

const Home: NextPage<HomeProps> = ({ offices, players, mostRecentGame }) => {
  useNavigationState('Offices');

  return (
    <Box>
      <SEO />
      <Hero offices={offices} />
      <Container bg="grey.2" position="relative" maxW="container.xl">
        <SimpleGrid columns={{ md: 2 }} gap={4}>
          {mostRecentGame.gameId && mostRecentGame.seasonId && <LeaderboardBlock gameId={mostRecentGame.gameId} />}
          <AddMatchBlock players={players} />
          <PlayersBlock players={players} />
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const offices = await getOffices();
  const players = await getPlayerSample();
  const mostRecentGame = await getMostRecentGame();

  return {
    props: { offices, players, mostRecentGame },
    revalidate: 600,
  };
};

export default Home;

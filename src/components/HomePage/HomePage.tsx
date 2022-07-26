import SEO from '@/components/shared/SEO';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import type { HomePageProps } from '@/pages';
import { Box, Container, SimpleGrid } from '@chakra-ui/react';
import type { NextPage } from 'next';
import AddMatchBlock from './blocks/AddMatchBlock';
import LeaderboardBlock from './blocks/LeaderboardBlock';
import PlayersBlock from './blocks/PlayersBlock';
import Hero from './Hero';

const HomePage: NextPage<HomePageProps> = ({ offices, players, mostRecentGame }) => {
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

export default HomePage;

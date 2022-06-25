import { Box, Heading } from '@chakra-ui/react';
import { Game, Season } from '@prisma/client';
import Leaderboard from '../Leaderboard';
import Section from './Section';

type LeaderboardBlockProps = {
  gameId?: Game['id'];
  seasonId?: Season['id'];
};

const LeaderboardBlock: React.VFC<LeaderboardBlockProps> = ({ gameId, seasonId }) => {
  return (
    <Section p={0} pb="100%" w="100%" h="500px" bg="grey.4">
      <Heading as="h2" color="grey.11" size="md" p={8} zIndex="1" position="relative">
        Climb up the leaderboards
      </Heading>
      <Box left="25%" position="absolute" w="100%" zIndex="0">
        {gameId && <Leaderboard gameId={gameId} seasonId={seasonId} />}
      </Box>
    </Section>
  );
};

export default LeaderboardBlock;

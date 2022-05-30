import { Box, Heading } from '@chakra-ui/react';
import { Game } from '@prisma/client';
import Leaderboard from '../Leaderboard';
import Section from './Section';

type LeaderboardBlockProps = {
  gameId?: Game['id'];
};

const LeaderboardBlock: React.VFC<LeaderboardBlockProps> = ({ gameId }) => {
  return (
    <Section p={0} pb="100%" w="100%" h="500px" bg="grey.4">
      <Heading as="h2" color="grey.11" size="md" p={8} zIndex="1" position="relative">
        Climb up the leaderboards
      </Heading>
      <Box left="25%" position="absolute" w="100%" zIndex="0">
        {gameId && <Leaderboard gameId={gameId} />}
      </Box>
    </Section>
  );
};

export default LeaderboardBlock;

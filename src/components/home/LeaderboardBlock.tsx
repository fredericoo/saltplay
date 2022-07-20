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
    <Section p={0} pb="100%" w="100%" h="500px" bg="grey.4" display="flex" flexDirection="column">
      <Heading as="h2" color="grey.11" size="md" p={8} zIndex="1" position="relative">
        Climb up the leaderboards
      </Heading>
      <Box
        position="relative"
        css={{ perspective: '1000px' }}
        p={4}
        flexGrow="1"
        sx={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) calc(100% - 128px), rgba(0,0,0,0))' }}
      >
        <Box left="25%" top="10%" position="absolute" w="100%" zIndex="0" transform="rotateY(30deg)">
          {gameId && <Leaderboard gameId={gameId} seasonId={seasonId} />}
        </Box>
      </Box>
    </Section>
  );
};

export default LeaderboardBlock;

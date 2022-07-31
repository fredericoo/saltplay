import Leaderboard from '@/components/shared/Leaderboard';
import TV from '@/layouts/TV';
import type { PageWithLayout } from '@/layouts/types';
import type { OfficeDashboardPageProps } from '@/pages/[office]/dashboard';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';

const OfficeDashboardPage: PageWithLayout<OfficeDashboardPageProps> = ({ office }) => {
  if (!office) return <Box>404</Box>;

  return (
    <SimpleGrid minChildWidth={'400px'} gap={4}>
      {office.games.map(game => (
        <Box bg="grey.1" key={game.id} p={4} borderRadius="xl">
          <Text mb={4} fontSize="3xl">
            {game.name}
          </Text>
          <Leaderboard gameId={game.id} hasIcons={false} />
        </Box>
      ))}
    </SimpleGrid>
  );
};

OfficeDashboardPage.Layout = TV;

export default OfficeDashboardPage;

import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import Leaderboard from '@/components/shared/Leaderboard';
import Medal from '@/components/shared/Medal';
import SEO from '@/components/shared/SEO';
import Stat from '@/components/shared/Stat';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import { formatDateTime } from '@/lib/utils';
import type { SeasonPageProps } from '@/pages/[office]/[game]/[season]';
import type { FCC } from '@/types';
import { Box, Container, Grid, Heading, HStack, Stack, VStack } from '@chakra-ui/react';
import PlayerAvatar from '../shared/PlayerAvatar';

const SeasonPage: FCC<SeasonPageProps> = ({ season }) => {
  useNavigationState(season.name);
  const prizes = season.scores.flatMap(score => score.player.medals.map(medal => ({ medal, player: score.player })));

  return (
    <Container maxW="container.sm" pt={NAVBAR_HEIGHT}>
      <SEO title={season.name} />

      <Stack spacing={8}>
        <Box bg="grey.1" borderRadius="18" overflow="hidden">
          <Grid
            bg={season.colour ? `#${season.colour}30` : 'grey.9'}
            p={8}
            gridTemplateAreas='"medal-3 medal-1 medal-2"'
            alignItems="end"
            justifyItems="center"
            justifyContent="center"
            gap={8}
          >
            {prizes.map(({ medal, player }, index) => (
              <VStack spacing={-4} key={medal.id} gridArea={`medal-${index + 1}`}>
                <PlayerAvatar user={player} size="16" />
                <Box fontSize={index > 0 ? '1.25rem' : '2rem'} pointerEvents="none">
                  <Medal id={medal.id} seasonId={season.id} />
                </Box>
              </VStack>
            ))}
          </Grid>
          <Box p={4}>
            <Heading as="h1" size="lg" my={2}>
              {season.game.name} {season.name}
            </Heading>
            <Heading as="h2" size="md" fontWeight="normal">
              in {season.game.office.name}
            </Heading>
          </Box>
          <HStack flexWrap={'wrap'} spacing={{ base: 1, md: 0.5 }} p={1}>
            <Stat label="Started" content={formatDateTime(new Date(season.startDate), { dateStyle: 'medium' })} />
            <Stat
              label="Finished"
              content={season.endDate ? formatDateTime(new Date(season.endDate), { dateStyle: 'medium' }) : 'Not yet'}
            />
          </HStack>
        </Box>
        {season.game && <Leaderboard gameId={season.game.id} seasonId={season.id} />}
      </Stack>
    </Container>
  );
};

export default SeasonPage;

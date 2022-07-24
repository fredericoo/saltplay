import PageHeader from '@/components/GamePage/PageHeader';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import FloatingActionButton from '@/components/shared/FloatingActionButton';
import LatestMatches from '@/components/shared/LatestMatches';
import useLatestMatches from '@/components/shared/LatestMatches/useLatestMatches';
import Leaderboard from '@/components/shared/Leaderboard';
import useLeaderboard from '@/components/shared/Leaderboard/useLeaderboard';
import NewMatchButton from '@/components/shared/NewMatchButton';
import SEO from '@/components/shared/SEO';
import Settings from '@/components/shared/Settings';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import { canViewDashboard } from '@/lib/roles';
import hideScrollbar from '@/lib/styleUtils';
import useMediaQuery from '@/lib/useMediaQuery';
import { formatDateTime } from '@/lib/utils';
import type { GamePageProps } from '@/pages/[office]/[game]';
import { Box, Container, Grid, Heading, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRef } from 'react';
import { IoRefreshSharp } from 'react-icons/io5';
import { VscEdit } from 'react-icons/vsc';

const GamePage: NextPage<GamePageProps> = ({ game }) => {
  useNavigationState(game?.name);
  const isDesktop = useMediaQuery('xl');
  const { mutate, isValidating } = useLeaderboard({ gameId: game?.id });
  const { mutate: mutateLatestMatches } = useLatestMatches({ gameId: game?.id });
  const headerRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const activeSeasons = game.seasons
    ?.filter(season => !season.endDate)
    .sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));
  const inactiveSeasons = game.seasons
    ?.filter(season => !!season.endDate)
    .sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));

  return (
    <Container maxW="container.lg" pt={NAVBAR_HEIGHT}>
      <PageHeader title={game.name} subtitle={`at the ${game.office.name} office`} icon={game?.icon} ref={headerRef} />

      <SEO title={game?.name} />
      <FloatingActionButton
        buttons={[
          {
            label: 'edit',
            icon: <VscEdit />,
            colorScheme: 'success',
            href: `/admin/games/${game.id}`,
            isHidden: !canViewDashboard(session?.user.roleId),
          },
          {
            label: 'refresh',
            icon: <IoRefreshSharp />,
            colorScheme: 'grey',
            onClick: () => {
              mutate();
              mutateLatestMatches();
            },
            isLoading: isValidating,
          },
        ]}
      />
      {isDesktop ? (
        <Grid position="relative" w="100%" gap={8} templateColumns={{ base: '1fr', xl: '2fr 1fr' }}>
          <Box as="section" bg="grey.4" borderRadius="xl" alignSelf="start" minH="100vh" overflow="hidden">
            <Tabs isLazy variant="typographic">
              <TabList>
                {game.seasons.length > 1 ? (
                  activeSeasons.map(season => <Tab key={season.id}>{season.name}</Tab>)
                ) : activeSeasons.length > 0 ? (
                  <Tab>Leaderboard</Tab>
                ) : null}
                {inactiveSeasons.length > 0 && <Tab>Past seasons</Tab>}
              </TabList>
              <TabPanels>
                {activeSeasons.map(season => (
                  <TabPanel key={season.id}>
                    <Leaderboard
                      bg="grey.4"
                      seasonId={season.id}
                      gameId={game.id}
                      stickyMe
                      offsetPlayerBottom=".5rem"
                    />
                  </TabPanel>
                ))}
                {inactiveSeasons.length > 0 && (
                  <TabPanel>
                    <Settings.List>
                      {inactiveSeasons.map(season => (
                        <Settings.Link
                          key={season.id}
                          icon={<Box w="1.5rem" h="1.5rem" borderRadius="lg" bgColor={`#${season.colour}`} />}
                          href={`/${game.office.slug}/${game.slug}/${season.slug}`}
                        >
                          <Text>{season.name}</Text>
                          <Box fontSize="xs" textTransform="uppercase" letterSpacing="widest" color="grey.11">
                            {[
                              formatDateTime(new Date(season.startDate), { dateStyle: 'short' }),
                              season.endDate && formatDateTime(new Date(season.endDate), { dateStyle: 'short' }),
                            ].join('—')}
                          </Box>
                        </Settings.Link>
                      ))}
                    </Settings.List>
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </Box>
          <Box
            as="section"
            position="sticky"
            top={`calc(${NAVBAR_HEIGHT} + .5rem)`}
            h={`calc(100vh - ${NAVBAR_HEIGHT} - 1rem)`}
            overflow={'auto'}
            px={4}
            mx={-4}
            css={hideScrollbar}
          >
            <Box
              as="header"
              position="sticky"
              top="0"
              zIndex="docked"
              _before={{
                zIndex: '-1',
                content: "''",
                position: 'absolute',
                inset: '0 calc(var(--wrkplay-space-4) * -1)',
                bg: 'var(--wrkplay-colors-grey-2)',
                maskImage: 'linear-gradient(to top, rgba(0,0,0,0) , rgba(0,0,0,1) 33%) ',
                pointerEvents: 'none',
              }}
            >
              <Heading as="h2" size="md" pb={4} color="grey.10">
                Latest matches
              </Heading>
              <Stack mb={8}>
                {activeSeasons.map(season => (
                  <NewMatchButton
                    key={season.id}
                    season={season}
                    gameId={game.id}
                    maxPlayersPerTeam={game.maxPlayersPerTeam || 1}
                  />
                ))}
              </Stack>
            </Box>
            <LatestMatches gameId={game.id} />
            <Box
              aria-hidden
              zIndex="2"
              position="sticky"
              height="4rem"
              width="100%"
              bottom="0"
              left="0"
              _before={{
                zIndex: '-1',
                content: "''",
                position: 'absolute',
                inset: '0',
                bg: 'var(--wrkplay-colors-grey-2)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) , rgba(0,0,0,1) 75%) ',
              }}
            />
          </Box>
        </Grid>
      ) : (
        <Box position="relative">
          <Stack>
            {activeSeasons.map(season => (
              <NewMatchButton
                key={season.id}
                season={season}
                gameId={game.id}
                maxPlayersPerTeam={game.maxPlayersPerTeam || 1}
              />
            ))}
          </Stack>
          <Tabs
            variant="bottom"
            onChange={() => {
              window.scrollTo(0, 0);
            }}
          >
            <SEO title={game.name} />
            <TabList>
              <Tab>Leaderboard</Tab>
              <Tab>Latest Matches</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Tabs isLazy variant="typographic" mx={-4}>
                  <TabList>
                    {game.seasons.length > 1 ? (
                      activeSeasons.map(season => <Tab key={season.id}>{season.name}</Tab>)
                    ) : activeSeasons.length > 0 ? (
                      <Tab pointerEvents="none">Leaderboard</Tab>
                    ) : null}
                    {inactiveSeasons.length > 0 && <Tab>Past seasons</Tab>}
                  </TabList>
                  <TabPanels>
                    {activeSeasons.map(season => (
                      <TabPanel key={season.id}>
                        <Leaderboard
                          bg="grey.2"
                          seasonId={season.id}
                          gameId={game.id}
                          stickyMe
                          offsetPlayerBottom="calc(env(safe-area-inset-bottom) + 48px - .5rem)"
                        />
                      </TabPanel>
                    ))}
                    {inactiveSeasons.length > 0 && (
                      <TabPanel>
                        <Settings.List>
                          {inactiveSeasons.map(season => (
                            <Settings.Link
                              key={season.id}
                              icon={<Box w="1.5rem" h="1.5rem" borderRadius="lg" bgColor={`#${season.colour}`} />}
                              href={`/${game.office.slug}/${game.slug}/${season.slug}`}
                            >
                              <Text fontWeight="bold">{season.name}</Text>
                              <Box fontSize="xs" textTransform="uppercase" letterSpacing="widest" color="grey.11">
                                {[
                                  formatDateTime(new Date(season.startDate), { dateStyle: 'short' }),
                                  season.endDate && formatDateTime(new Date(season.endDate), { dateStyle: 'short' }),
                                ].join('—')}
                              </Box>
                            </Settings.Link>
                          ))}
                        </Settings.List>
                      </TabPanel>
                    )}
                  </TabPanels>
                </Tabs>
              </TabPanel>
              <TabPanel pt={{ base: 8, md: 4 }}>
                <LatestMatches gameId={game.id} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </Container>
  );
};

export default GamePage;

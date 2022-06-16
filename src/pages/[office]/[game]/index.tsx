import FloatingActionButton from '@/components/FloatingActionButton';
import LatestMatches from '@/components/LatestMatches';
import useLatestMatches from '@/components/LatestMatches/useLatestMatches';
import Leaderboard from '@/components/Leaderboard';
import useLeaderboard from '@/components/Leaderboard/useLeaderboard';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import NewMatchButton from '@/components/NewMatchButton';
import PageHeader from '@/components/PageHeader';
import SEO from '@/components/SEO';
import Settings from '@/components/Settings';
import { PAGE_REVALIDATE_SECONDS } from '@/constants';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import hideScrollbar from '@/lib/styleUtils';
import useMediaQuery from '@/lib/useMediaQuery';
import { Box, Container, Grid, Heading, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { Game, Office } from '@prisma/client';
import { format, isAfter } from 'date-fns';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRef } from 'react';
import { IoRefreshSharp } from 'react-icons/io5';
import { VscEdit } from 'react-icons/vsc';

const getGame = async (gameSlug: Game['slug'], officeId: Office['id']) => {
  const response = await prisma.game.findUnique({
    where: { slug_officeid: { slug: gameSlug, officeid: officeId } },
    select: {
      office: {
        select: {
          name: true,
          slug: true,
        },
      },
      seasons: {
        select: {
          id: true,
          slug: true,
          name: true,
          endDate: true,
          startDate: true,
        },
      },
      name: true,
      slug: true,
      icon: true,
      id: true,
      maxPlayersPerTeam: true,
    },
  });
  if (!response) return null;

  const responseWithoutDates = {
    ...response,
    seasons: response.seasons.map(season => ({
      ...season,
      startDate: season.startDate.toISOString(),
      endDate: season.endDate?.toISOString() || null,
    })),
  };

  return responseWithoutDates;
};

type GamePageProps = {
  game: NonNullable<Awaited<ReturnType<typeof getGame>>>;
};

const GamePage: NextPage<GamePageProps> = ({ game }) => {
  useNavigationState(game?.name);
  const isDesktop = useMediaQuery('xl');
  const { mutate, isValidating } = useLeaderboard({ gameId: game?.id });
  const { mutate: mutateLatestMatches } = useLatestMatches({ gameId: game?.id });
  const headerRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const activeSeasons = game.seasons
    ?.filter(
      season =>
        (!season.endDate || isAfter(new Date(season.endDate), new Date())) &&
        isAfter(new Date(), new Date(season.startDate))
    )
    .sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));
  const pastSeasons = game.seasons
    ?.filter(season => season.endDate && isAfter(new Date(), new Date(season.endDate)))
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
                ) : (
                  <Tab>Leaderboard</Tab>
                )}
                {pastSeasons.length > 0 && <Tab>Past seasons</Tab>}
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
                {pastSeasons.length > 0 && (
                  <TabPanel>
                    <Settings.List>
                      {pastSeasons.map(season => (
                        <Settings.Link
                          icon={'🗓'}
                          key={season.id}
                          href={`/${game.office.slug}/${game.slug}/${season.slug}`}
                        >
                          {season.name}
                          <Box fontSize="xs" textTransform="uppercase" letterSpacing="widest">
                            {[
                              format(new Date(season.startDate), 'MMM d'),
                              season.endDate ? format(new Date(season.endDate), 'MMM d') : undefined,
                            ].join(' — ')}
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
              {activeSeasons.length < game.seasons.length && process.env.NEXT_PUBLIC_ENABLE_SEASONS === 'true' && (
                <Tab>Past seasons</Tab>
              )}
            </TabList>
            <TabPanels>
              <TabPanel>
                <Tabs isLazy variant="typographic">
                  <TabList>
                    {game.seasons.length > 1 ? (
                      activeSeasons.map(season => <Tab key={season.id}>{season.name}</Tab>)
                    ) : (
                      <Tab>Leaderboard</Tab>
                    )}
                    {activeSeasons.length < game.seasons.length &&
                      process.env.NEXT_PUBLIC_ENABLE_SEASONS === 'true' && <Tab>Past seasons</Tab>}
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
                    {activeSeasons.length < game.seasons.length &&
                      process.env.NEXT_PUBLIC_ENABLE_SEASONS === 'true' && <TabPanel>Past seasons</TabPanel>}
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

export const getStaticPaths: GetStaticPaths = async () => {
  const games = await prisma.game.findMany({ select: { slug: true, office: { select: { slug: true } } } });

  return {
    paths: games.map(game => ({
      params: {
        game: game.slug,
        office: game.office.slug,
      },
    })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<GamePageProps> = async ({ params }) => {
  if (typeof params?.office !== 'string' || typeof params?.game !== 'string') {
    return {
      notFound: true,
    };
  }

  const office = await prisma.office.findUnique({ where: { slug: params.office }, select: { id: true } });
  if (!office)
    return {
      notFound: true,
    };

  const game = await getGame(params.game, office.id);

  if (!game)
    return {
      notFound: true,
    };

  return {
    props: {
      game,
    },
    revalidate: PAGE_REVALIDATE_SECONDS,
  };
};

export default GamePage;

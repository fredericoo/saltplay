import FloatingActionButton from '@/components/FloatingActionButton';
import LatestMatches from '@/components/LatestMatches';
import useLatestMatches from '@/components/LatestMatches/useLatestMatches';
import Leaderboard from '@/components/Leaderboard';
import useLeaderboard from '@/components/Leaderboard/useLeaderboard';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import NewMatchButton from '@/components/NewMatchButton';
import PageHeader from '@/components/PageHeader';
import SEO from '@/components/SEO';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import hideScrollbar from '@/lib/styleUtils';
import useMediaQuery from '@/lib/useMediaQuery';
import { Box, Container, Grid, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { Game, Office } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRef } from 'react';
import { IoRefreshSharp } from 'react-icons/io5';
import { VscEdit } from 'react-icons/vsc';

const getGame = (gameSlug: Game['slug'], officeId: Office['id']) =>
  prisma.game.findUnique({
    where: { slug_officeid: { slug: gameSlug, officeid: officeId } },
    select: {
      office: {
        select: {
          name: true,
        },
      },
      name: true,
      slug: true,
      icon: true,
      id: true,
      maxPlayersPerTeam: true,
    },
  });

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
          <Box as="section" bg="grey.4" p={2} borderRadius="xl" alignSelf="start">
            <Heading as="h2" size="md" pl="12" pt={2} pb={4} color="grey.10" flexGrow="1">
              Leaderboard
            </Heading>

            <Leaderboard bg="grey.4" gameId={game.id} stickyMe offsetPlayerBottom=".5rem" />
          </Box>
          <Box
            as="section"
            position="sticky"
            top={`calc(${headerRef?.current?.getBoundingClientRect().height || 0}px)`}
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
              <NewMatchButton gameId={game.id} maxPlayersPerTeam={game.maxPlayersPerTeam || 1} mb={8} />
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
          <NewMatchButton gameId={game.id} maxPlayersPerTeam={game.maxPlayersPerTeam || 1} />
          <Tabs
            variant={'bottom'}
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
                <Leaderboard
                  bg="grey.2"
                  gameId={game.id}
                  offsetPlayerBottom="calc(env(safe-area-inset-bottom) + 48px - .5rem)"
                  stickyMe
                />
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

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
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

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');

  return {
    props: {
      game,
    },
  };
};

export default GamePage;

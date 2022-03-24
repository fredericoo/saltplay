import LatestMatches from '@/components/LatestMatches';
import Leaderboard from '@/components/Leaderboard';
import useLeaderboard from '@/components/Leaderboard/useLeaderboard';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import NewMatchButton from '@/components/NewMatchButton';
import PageHeader from '@/components/PageHeader';
import { PageHeader as PageHeaderType } from '@/components/PageHeader/types';
import SEO from '@/components/SEO';
import { Sidebar } from '@/components/Sidebar/types';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import useMediaQuery from '@/lib/useMediaQuery';
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { Game } from '@prisma/client';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRef } from 'react';
import { IoRefreshSharp } from 'react-icons/io5';

export const getOfficeWithGames = async (officeSlug: string) =>
  await prisma.office.findUnique({
    where: { slug: officeSlug },
    select: {
      name: true,
      slug: true,
      games: {
        orderBy: { name: 'asc' },
        select: {
          name: true,
          slug: true,
          icon: true,
          id: true,
          maxPlayersPerTeam: true,
        },
      },
    },
  });

type GamePageProps = {
  game?: Pick<Game, 'name' | 'slug' | 'id' | 'icon' | 'maxPlayersPerTeam'>;
  header: PageHeaderType;
};

const GamePage: NextPage<GamePageProps> = ({ game, header }) => {
  useNavigationState(game?.name);
  const isDesktop = useMediaQuery('xl');
  const { mutate, isValidating } = useLeaderboard({ gameId: game?.id });

  const headerRef = useRef<HTMLDivElement>(null);

  if (!game) {
    return <div>404</div>;
  }

  if (isDesktop)
    return (
      <Container maxW="container.lg" pt={NAVBAR_HEIGHT}>
        <SEO title={game.name} />
        <PageHeader {...header} ref={headerRef} />
        <Grid position="relative" w="100%" gap={8} templateColumns={{ base: '1fr', xl: '2fr 1fr' }}>
          <Box as="section" bg="grey.4" p={2} borderRadius="xl" alignSelf="start">
            <HStack justifyContent="flex-end" pb="4">
              <Heading as="h2" size="md" pl="12" color="grey.10" flexGrow="1">
                Leaderboard
              </Heading>
              <Button
                aria-label="Refresh"
                isLoading={isValidating}
                variant="subtle"
                colorScheme="grey"
                _hover={{ bg: 'grey.1' }}
                onClick={() => mutate()}
              >
                <IoRefreshSharp size="1.5rem" />
              </Button>
            </HStack>
            <Leaderboard gameId={game.id} stickyMe offsetPlayerBottom=".5rem" />
          </Box>
          <Box
            as="section"
            position="sticky"
            top={`calc(${headerRef?.current?.getBoundingClientRect().height || 0}px)`}
            h={`calc(100vh - ${NAVBAR_HEIGHT} - 1rem)`}
            overflow={'auto'}
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
                inset: '0',
                bg: 'var(--chakra-colors-grey-2)',
                maskImage: 'linear-gradient(to top, rgba(0,0,0,0) , rgba(0,0,0,1) 33%) ',
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
                bg: 'var(--chakra-colors-grey-2)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) , rgba(0,0,0,1) 75%) ',
              }}
            />
          </Box>
        </Grid>
      </Container>
    );

  return (
    <Container maxW="container.lg" pt={NAVBAR_HEIGHT}>
      <PageHeader {...header} />
      <Box position="relative">
        <NewMatchButton gameId={game.id} maxPlayersPerTeam={game.maxPlayersPerTeam || 1} />
        <Tabs variant={'bottom'}>
          <SEO title={game.name} />
          <TabList>
            <Tab>
              <Box fontSize="lg" aria-hidden>
                🏆
              </Box>
              <Box>Leaderboard</Box>
            </Tab>
            <Tab>
              <Box fontSize="lg" aria-hidden>
                {game.icon}
              </Box>
              <Box>Latest Matches</Box>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Button
                w="100%"
                size="md"
                isLoading={isValidating}
                variant="subtle"
                colorScheme="grey"
                bg="grey.1"
                mb={4}
                onClick={() => mutate()}
                leftIcon={<IoRefreshSharp size="1.5rem" />}
              >
                Refresh
              </Button>
              <Leaderboard gameId={game.id} offsetPlayerBottom="calc(105px - .5rem)" stickyMe />
            </TabPanel>
            <TabPanel pt={4}>
              <LatestMatches gameId={game.id} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const offices = await prisma.office.findMany({
    include: { games: true },
  });
  return {
    paths: offices
      .map(office => office.games.map(game => ({ params: { office: office.slug, game: game.slug } })))
      .flat(),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (typeof params?.office !== 'string' || typeof params?.game !== 'string') {
    return {
      props: {},
    };
  }

  const office = await getOfficeWithGames(params.office);

  if (!office) {
    return {
      props: {},
    };
  }

  const game = office.games.find(game => game.slug === params.game);

  const sidebar: Sidebar = {
    items: office.games.map(game => ({
      title: game.name,
      href: `/${office.slug}/${game.slug}`,
      icon: game.icon || null,
    })),
  };

  const header: PageHeaderType = {
    title: game?.name || null,
    subtitle: `at the ${office.name} office`,
    icon: game?.icon || null,
  };

  return {
    props: {
      game,
      sidebar,
      header,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default GamePage;

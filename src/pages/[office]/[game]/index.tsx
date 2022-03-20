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
  const isDesktop = useMediaQuery('xl');
  const { mutate, isValidating } = useLeaderboard({ gameId: game?.id });
  useNavigationState(game?.name);

  if (!game) {
    return <div>404</div>;
  }

  if (isDesktop)
    return (
      <Container maxW="container.lg" pt={NAVBAR_HEIGHT}>
        <PageHeader {...header} />
        <Grid position="relative" w="100%" gap={8} templateColumns={{ base: '1fr', xl: '2fr 1fr' }}>
          <SEO title={game.name} />
          <Box as="section" bg="grey.4" p={2} borderRadius="xl">
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
            <Leaderboard gameId={game.id} />
          </Box>
          <Box as="section">
            <Heading as="h2" size="md" pb={4} color="grey.10">
              Latest matches
            </Heading>
            <NewMatchButton gameId={game.id} maxPlayersPerTeam={game.maxPlayersPerTeam || 1} mb={8} />
            <LatestMatches gameId={game.id} />
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
            <Tab>Leaderboard</Tab>
            <Tab>Latest Matches</Tab>
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
              <Leaderboard gameId={game.id} />
            </TabPanel>
            <TabPanel>
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

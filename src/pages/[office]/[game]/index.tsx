import LatestMatches from '@/components/LatestMatches';
import Leaderboard from '@/components/Leaderboard';
import NewMatchButton from '@/components/NewMatchButton';
import { PageHeader } from '@/components/PageHeader/types';
import SEO from '@/components/SEO';
import { Sidebar } from '@/components/Sidebar/types';
import prisma from '@/lib/prisma';
import useMediaQuery from '@/lib/useMediaQuery';
import { Box, Grid, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { Game } from '@prisma/client';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

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
};

const GamePage: NextPage<GamePageProps> = ({ game }) => {
  const isDesktop = useMediaQuery('xl');

  if (!game) {
    return <div>404</div>;
  }

  if (isDesktop)
    return (
      <Grid w="100%" gap={8} templateColumns={{ base: '1fr', xl: '2fr 1fr' }}>
        <SEO title={game.name} />
        <Box as="section">
          <Heading as="h2" size="sm" pb={4}>
            Leaderboard
          </Heading>
          <Leaderboard gameId={game.id} />
        </Box>
        <Box as="section">
          <Heading as="h2" size="sm" pb={4}>
            Latest matches
          </Heading>
          <NewMatchButton gameId={game.id} maxPlayersPerTeam={game.maxPlayersPerTeam || 1} mb={8} />
          <LatestMatches gameId={game.id} />
        </Box>
      </Grid>
    );

  return (
    <Box>
      <NewMatchButton gameId={game.id} maxPlayersPerTeam={game.maxPlayersPerTeam || 1} />
      <Tabs>
        <SEO title={game.name} />
        <TabList mb={4}>
          <Tab>Leaderboard</Tab>
          <Tab>Latest Matches</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Leaderboard gameId={game.id} />
          </TabPanel>
          <TabPanel>
            <LatestMatches gameId={game.id} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
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

  const header: PageHeader = {
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

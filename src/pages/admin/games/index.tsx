import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import PageHeader from '@/components/PageHeader';
import SEO from '@/components/SEO';
import Settings from '@/components/Settings';
import { withDashboardAuth } from '@/lib/admin';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { Container } from '@chakra-ui/react';
import type { NextPage } from 'next';

type AdminPageProps = {
  games: Awaited<ReturnType<typeof getGames>>;
};

export const getGames = () =>
  prisma.game.findMany({
    orderBy: { officeid: 'asc' },
    select: { id: true, name: true, icon: true, office: { select: { name: true } } },
  });

const AdminPage: NextPage<AdminPageProps> = ({ games }) => {
  useNavigationState('Games');
  return (
    <Container maxW="container.md" pt={NAVBAR_HEIGHT}>
      <SEO title="Games" />
      <PageHeader title={'Games'} icon={'🎲'} subtitle={`showing ${games.length} results`} />
      <Settings.List>
        {games.map(game => (
          <Settings.Link
            icon={game.icon ?? undefined}
            href={`/admin/games/${game.id}`}
            key={game.id}
            helper={game.office.name}
          >
            {game.name}
          </Settings.Link>
        ))}
      </Settings.List>
    </Container>
  );
};

export default AdminPage;

export const getServerSideProps = withDashboardAuth(async () => {
  return {
    props: {
      games: await getGames(),
    },
  };
});

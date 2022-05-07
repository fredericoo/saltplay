import Breadcrumbs from '@/components/Breadcrumbs';
import SEO from '@/components/SEO';
import Settings from '@/components/Settings';
import Admin from '@/layouts/Admin';
import { PageWithLayout } from '@/layouts/types';
import { withDashboardAuth } from '@/lib/admin';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { Stack } from '@chakra-ui/react';

type AdminPageProps = {
  games: Awaited<ReturnType<typeof getGames>>;
};

const getGames = () =>
  prisma.game.findMany({
    orderBy: { officeid: 'asc' },
    select: { id: true, name: true, icon: true, office: { select: { name: true } } },
  });

const AdminPage: PageWithLayout<AdminPageProps> = ({ games }) => {
  useNavigationState('Games');
  return (
    <Stack spacing={8}>
      <Breadcrumbs px={2} levels={[{ label: 'Admin', href: '/admin' }, { label: 'Games' }]} />
      <Settings.List>
        <SEO title="Games" />
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
        <Settings.Link href="/admin/games/new" showChevron={false} color="primary.10">
          Add Game
        </Settings.Link>
      </Settings.List>
    </Stack>
  );
};

AdminPage.Layout = Admin;

export default AdminPage;

export const getServerSideProps = withDashboardAuth(async () => {
  return {
    props: {
      games: await getGames(),
    },
  };
});

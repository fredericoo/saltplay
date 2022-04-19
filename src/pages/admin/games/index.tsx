import SEO from '@/components/SEO';
import Settings from '@/components/Settings';
import Admin from '@/layouts/Admin';
import { PageWithLayout } from '@/layouts/types';
import { withDashboardAuth } from '@/lib/admin';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';

type AdminPageProps = {
  games: Awaited<ReturnType<typeof getGames>>;
};

export const getGames = () =>
  prisma.game.findMany({
    orderBy: { officeid: 'asc' },
    select: { id: true, name: true, icon: true, office: { select: { name: true } } },
  });

const AdminPage: PageWithLayout<AdminPageProps> = ({ games }) => {
  useNavigationState('Games');
  return (
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
    </Settings.List>
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

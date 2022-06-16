import Breadcrumbs from '@/components/Breadcrumbs';
import SEO from '@/components/SEO';
import Settings from '@/components/Settings';
import Admin from '@/layouts/Admin';
import { PageWithLayout } from '@/layouts/types';
import { withDashboardAuth } from '@/lib/admin';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { Stack } from '@chakra-ui/react';
import { groupBy } from 'ramda';

type AdminPageProps = {
  seasons: NonNullable<Awaited<ReturnType<typeof getSeasons>>>;
};

const getSeasons = () =>
  prisma.season.findMany({
    orderBy: { startDate: 'asc' },
    select: { id: true, name: true, game: { select: { name: true, icon: true, office: { select: { name: true } } } } },
  });

const groupByOffice = groupBy((season: AdminPageProps['seasons'][number]) => season.game.office.name);

const AdminPage: PageWithLayout<AdminPageProps> = ({ seasons }) => {
  useNavigationState('Seasons');

  return (
    <Stack spacing={8}>
      <SEO title="Seasons" />
      <Breadcrumbs
        px={2}
        levels={[
          { label: 'Admin', href: '/admin' },
          { label: 'Seasons', href: '/admin/seasons' },
        ]}
      />
      {Object.entries(groupByOffice(seasons)).map(([officeName, seasons]) => (
        <Settings.List key={officeName} label={officeName}>
          {seasons.map(season => (
            <Settings.Link
              icon={season.game.icon}
              href={`/admin/seasons/${season.id}`}
              key={season.id}
              helper={season.game.name}
            >
              {season.name}
            </Settings.Link>
          ))}
        </Settings.List>
      ))}

      <Settings.List>
        <Settings.Link href="/admin/seasons/new" showChevron={false} color="primary.10">
          Add Season
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
      seasons: await getSeasons(),
    },
  };
});

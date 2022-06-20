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
  offices: Awaited<ReturnType<typeof getOffices>>;
};

const getOffices = () =>
  prisma.office.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, icon: true, slug: true, games: { select: { id: true } } },
  });

const AdminPage: PageWithLayout<AdminPageProps> = ({ offices }) => {
  useNavigationState('Offices');
  return (
    <Stack spacing={8}>
      <Breadcrumbs
        px={2}
        levels={[
          { label: 'Admin', href: '/admin' },
          { label: 'Offices', href: '/admin/offices' },
        ]}
      />
      <Settings.List>
        <SEO title="Offices" />
        {offices.map(office => (
          <Settings.Link icon={office.icon ?? undefined} href={`/admin/offices/${office.id}`} key={office.name}>
            {' '}
            {office.name}{' '}
          </Settings.Link>
        ))}
        <Settings.Link href="/admin/offices/new" showChevron={false} highlight>
          Add office
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
      offices: await getOffices(),
    },
  };
});

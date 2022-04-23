import Breadcrumbs from '@/components/Breadcrumbs';
import SEO from '@/components/SEO';
import Settings from '@/components/Settings';
import Admin from '@/layouts/Admin';
import { PageWithLayout } from '@/layouts/types';
import { Stack } from '@chakra-ui/react';

const AdminPage: PageWithLayout = () => {
  return (
    <Stack spacing={8}>
      <Breadcrumbs px={2} levels={[{ label: 'Admin' }]} />
      <Settings.List>
        <SEO title="Dashboard" />
        <Settings.Link href="/admin/offices" icon="🏢">
          Offices
        </Settings.Link>
        <Settings.Link href="/admin/games" icon="🎲">
          Games
        </Settings.Link>
        <Settings.Link href="/admin/users" icon="🙋‍♀️">
          Users
        </Settings.Link>
      </Settings.List>
    </Stack>
  );
};

AdminPage.Layout = Admin;

export default AdminPage;

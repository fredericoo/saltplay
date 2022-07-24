import ConfirmButton from '@/components/admin/ConfirmButton';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import SEO from '@/components/shared/SEO';
import Settings from '@/components/shared/Settings';
import Admin from '@/layouts/Admin';
import type { PageWithLayout } from '@/layouts/types';
import { withDashboardAuth } from '@/lib/admin';
import { Stack } from '@chakra-ui/react';
import axios from 'axios';

const AdminPage: PageWithLayout = () => {
  return (
    <Stack spacing={8}>
      <Breadcrumbs px={2} levels={[{ label: 'Admin', href: '/admin' }]} />
      <Settings.List>
        <SEO title="Dashboard" />
        <Settings.Link href="/admin/offices" icon="🏢">
          All Offices
        </Settings.Link>
        <Settings.Link href="/admin/games" icon="🎲">
          All Games
        </Settings.Link>
        <Settings.Link href="/admin/users" icon="🙋‍♀️">
          All Users
        </Settings.Link>
        <Settings.Link href="/admin/seasons" icon="🎖">
          All Seasons
        </Settings.Link>
      </Settings.List>
      <Settings.List label="Danger zone">
        <Settings.Item label="Sign out everyone">
          <ConfirmButton
            onConfirm={async () => {
              await axios.delete(`/api/sessions`);
              window.location.pathname = '/';
            }}
            keyword="confirm"
          >
            Clear all sessions
          </ConfirmButton>
        </Settings.Item>
      </Settings.List>
    </Stack>
  );
};

export const getServerSideProps = withDashboardAuth(async () => {
  return {
    props: {},
  };
});

AdminPage.Layout = Admin;

export default AdminPage;

import SEO from '@/components/SEO';
import Settings from '@/components/Settings';
import Admin from '@/layouts/Admin';
import { PageWithLayout } from '@/layouts/types';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';

const AdminPage: PageWithLayout = () => {
  useNavigationState('Dashboard');
  return (
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
  );
};

AdminPage.Layout = Admin;

export default AdminPage;

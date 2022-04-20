import SEO from '@/components/SEO';
import Settings from '@/components/Settings';
import Admin from '@/layouts/Admin';
import { PageWithLayout } from '@/layouts/types';
import { withDashboardAuth } from '@/lib/admin';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { roleIcons } from '@/lib/roles';

type AdminPageProps = {
  users: Awaited<ReturnType<typeof getUsers>>;
};

export const getUsers = () =>
  prisma.user.findMany({
    orderBy: [{ roleId: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true, image: true, roleId: true },
  });

const AdminPage: PageWithLayout<AdminPageProps> = ({ users }) => {
  useNavigationState('Users');
  return (
    <Settings.List>
      <SEO title="Users" />
      {users.map(user => (
        <Settings.Link icon={roleIcons[user.roleId]} href={`/admin/users/${user.id}`} key={user.id}>
          {user.name}
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
      users: await getUsers(),
    },
  };
});

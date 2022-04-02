import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import PageHeader from '@/components/PageHeader';
import RoleBadge from '@/components/RoleBadge';
import SEO from '@/components/SEO';
import Settings from '@/components/Settings';
import { withDashboardAuth } from '@/lib/admin';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { Container } from '@chakra-ui/react';
import type { NextPage } from 'next';

type AdminPageProps = {
  users: Awaited<ReturnType<typeof getUsers>>;
};

export const getUsers = () =>
  prisma.user.findMany({
    orderBy: [{ roleId: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true, image: true, roleId: true },
  });

const AdminPage: NextPage<AdminPageProps> = ({ users }) => {
  useNavigationState('Users');
  return (
    <Container maxW="container.md" pt={NAVBAR_HEIGHT}>
      <SEO title="Users" />
      <PageHeader title={'Users'} icon={'🙋‍♀️'} subtitle={`showing ${users.length} results`} />
      <Settings.List>
        {users.map(user => (
          <Settings.Link icon={<RoleBadge roleId={user.roleId} />} href={`/admin/users/${user.id}`} key={user.id}>
            {user.name}
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
      users: await getUsers(),
    },
  };
});

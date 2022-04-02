import List from '@/components/List';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import PageHeader from '@/components/PageHeader';
import { withDashboardAuth } from '@/lib/admin';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { Container } from '@chakra-ui/react';
import type { NextPage } from 'next';

type AdminPageProps = {
  offices: Awaited<ReturnType<typeof getOffices>>;
};

export const getOffices = () =>
  prisma.office.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, icon: true, slug: true, games: { select: { id: true } } },
  });

const AdminPage: NextPage<AdminPageProps> = ({ offices }) => {
  useNavigationState('Offices');
  return (
    <Container maxW="container.lg" pt={NAVBAR_HEIGHT}>
      <PageHeader title={'Admin Panel'} icon={'🔑'} subtitle="showing offices" />
      <List>
        {offices.map(office => (
          <List.Item icon={office.icon ?? undefined} href={`/admin/offices/${office.id}`} key={office.name}>
            {' '}
            {office.name}{' '}
          </List.Item>
        ))}
      </List>
    </Container>
  );
};

export default AdminPage;

export const getServerSideProps = withDashboardAuth(async () => {
  return {
    props: {
      offices: await getOffices(),
    },
  };
});

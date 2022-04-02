import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import PageHeader from '@/components/PageHeader';
import SEO from '@/components/SEO';
import Settings from '@/components/Settings';
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
    <Container maxW="container.md" pt={NAVBAR_HEIGHT}>
      <SEO title="Offices" />
      <PageHeader title={'Offices'} icon={'🏢'} subtitle={`showing ${offices.length} results`} />
      <Settings.List>
        {offices.map(office => (
          <Settings.Link icon={office.icon ?? undefined} href={`/admin/offices/${office.id}`} key={office.name}>
            {' '}
            {office.name}{' '}
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
      offices: await getOffices(),
    },
  };
});

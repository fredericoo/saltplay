import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import PageHeader from '@/components/PageHeader';
import SEO from '@/components/SEO';
import Settings from '@/components/Settings';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import { Container } from '@chakra-ui/react';
import type { NextPage } from 'next';

const AdminPage: NextPage = () => {
  useNavigationState('Dashboard');
  return (
    <Container maxW="container.md" pt={NAVBAR_HEIGHT}>
      <SEO title="Dashboard" />
      <PageHeader title={'Admin Panel'} />
      <Settings.List>
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
    </Container>
  );
};

export default AdminPage;

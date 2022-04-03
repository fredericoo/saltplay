import SettingsGroup from '@/components/admin/SettingsGroup';
import DeleteButton from '@/components/DeleteButton';
import List from '@/components/List';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import PageHeader from '@/components/PageHeader';
import Settings from '@/components/Settings';
import { WEBSITE_URL } from '@/constants';
import { EditableField, withDashboardAuth } from '@/lib/admin';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import useMediaQuery from '@/lib/useMediaQuery';
import { Button, Container, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { Office } from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { VscAdd } from 'react-icons/vsc';

type AdminPageProps = {
  office: Awaited<ReturnType<typeof getOffice>>;
};

const editableFields: EditableField<Office>[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'icon', label: 'Icon', type: 'text' },
  { id: 'slug', label: 'Slug', type: 'text', preText: WEBSITE_URL + '/' },
];

export const getOffice = (id: string) =>
  prisma.office.findUnique({
    where: { id },
    select: { id: true, name: true, icon: true, slug: true, games: { select: { id: true, name: true, icon: true } } },
  });

const AdminPage: NextPage<AdminPageProps> = ({ office }) => {
  const { push } = useRouter();
  const isDesktop = useMediaQuery('md');
  useNavigationState(office?.name);

  const handleDeleteOffice = async () => {
    await axios.delete(`/api/offices/${office?.id}`);
    push('/admin');
  };

  return (
    <Container maxW="container.lg" pt={NAVBAR_HEIGHT}>
      <PageHeader title={office?.name} icon={office?.icon} />
      <Tabs variant={isDesktop ? 'sidebar' : undefined} css={{ '--sidebar-width': '300px' }}>
        <TabList>
          <Tab>Info</Tab>
          <Tab>Games</Tab>
        </TabList>
        <TabPanels pt={4}>
          <TabPanel as={Stack} spacing={8}>
            <SettingsGroup fields={editableFields} saveEndpoint={`/api/offices/${office?.id}`} data={office} />
            <Settings.List>
              <Settings.Item label="Danger zone">
                <DeleteButton
                  keyword={`I want to delete all games and matches in ${office?.name || 'this office'}`}
                  onDelete={handleDeleteOffice}
                >
                  Delete Office
                </DeleteButton>
              </Settings.Item>
            </Settings.List>
          </TabPanel>
          <TabPanel>
            <List>
              {office?.games.map(game => (
                <List.Item icon={game.icon ?? undefined} href={`/admin/games/${game.id}`} key={game.id}>
                  {game.name}
                </List.Item>
              ))}
              <Button variant="subtle" colorScheme="success" leftIcon={<VscAdd />}>
                Create game
              </Button>
            </List>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default AdminPage;

export const getServerSideProps = withDashboardAuth(async ({ params }) => {
  if (typeof params?.id !== 'string') {
    return { props: {} };
  }
  return {
    props: {
      office: await getOffice(params.id),
    },
  };
});

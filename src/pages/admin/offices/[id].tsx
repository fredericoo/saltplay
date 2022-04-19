import SettingsGroup from '@/components/admin/SettingsGroup';
import DeleteButton from '@/components/DeleteButton';
import List from '@/components/List';
import Settings from '@/components/Settings';
import { WEBSITE_URL } from '@/constants';
import Admin from '@/layouts/Admin';
import { PageWithLayout } from '@/layouts/types';
import { EditableField, withDashboardAuth } from '@/lib/admin';
import { patchOfficeSchema } from '@/lib/api/schemas';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { toSlug, validateSlug } from '@/lib/slug';
import { Button, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { Office } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { VscAdd } from 'react-icons/vsc';

type AdminPageProps = {
  office: Awaited<ReturnType<typeof getOffice>>;
};

const editableFields: EditableField<Office>[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'icon', label: 'Icon', type: 'emoji' },
  {
    id: 'slug',
    label: 'Slug',
    type: 'text',
    preText: WEBSITE_URL + '/',
    validate: validateSlug,
    format: toSlug,
  },
];

export const getOffice = (id: string) =>
  prisma.office.findUnique({
    where: { id },
    select: { id: true, name: true, icon: true, slug: true, games: { select: { id: true, name: true, icon: true } } },
  });

const AdminPage: PageWithLayout<AdminPageProps> = ({ office }) => {
  const { push } = useRouter();
  useNavigationState(office?.name);

  const handleDeleteOffice = async () => {
    await axios.delete(`/api/offices/${office?.id}`);
    push('/admin');
  };

  return (
    <Tabs>
      <TabList>
        <Tab>Info</Tab>
        <Tab>Games</Tab>
      </TabList>
      <TabPanels pt={4}>
        <TabPanel as={Stack} spacing={8}>
          <SettingsGroup<Office>
            fieldSchema={patchOfficeSchema}
            fields={editableFields}
            saveEndpoint={`/api/offices/${office?.id}`}
            data={office}
          />
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
  );
};

AdminPage.Layout = Admin;

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

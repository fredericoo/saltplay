import SettingsGroup from '@/components/admin/SettingsGroup';
import Breadcrumbs from '@/components/Breadcrumbs';
import DeleteButton from '@/components/DeleteButton';
import Settings from '@/components/Settings';
import { WEBSITE_URL } from '@/constants';
import Admin from '@/layouts/Admin';
import { PageWithLayout } from '@/layouts/types';
import { EditableField, withDashboardAuth } from '@/lib/admin';
import { patchOfficeSchema } from '@/lib/api/schemas';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { toSlug } from '@/lib/slug';
import { Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { Office } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';

type AdminPageProps = {
  office: Awaited<ReturnType<typeof getOffice>>;
};

export const officeFields: EditableField<Office>[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'icon', label: 'Icon', type: 'emoji' },
  {
    id: 'slug',
    label: 'Slug',
    type: 'text',
    prefix: WEBSITE_URL + '/',
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
    <Stack spacing={8}>
      <Breadcrumbs
        px={2}
        levels={[
          { label: 'Admin', href: '/admin' },
          { label: 'Offices', href: '/admin/offices' },
          { label: office?.name || 'Office' },
        ]}
      />

      <Tabs>
        <TabList>
          <Tab>Info</Tab>
          <Tab>Games</Tab>
        </TabList>
        <TabPanels pt={4}>
          <TabPanel as={Stack} spacing={8}>
            <SettingsGroup<Office>
              fieldSchema={patchOfficeSchema}
              fields={officeFields}
              saveEndpoint={`/api/offices/${office?.id}`}
              data={office}
            />
            <Settings.List label="Danger zone">
              <Settings.Item label="Delete office and games">
                <DeleteButton keyword={office?.name.toLowerCase()} onDelete={handleDeleteOffice}>
                  Delete Office
                </DeleteButton>
              </Settings.Item>
            </Settings.List>
          </TabPanel>
          <TabPanel>
            <Settings.List label={`Games for ${office?.name || 'this office'}`}>
              {office?.games.map(game => (
                <Settings.Link icon={game.icon ?? undefined} href={`/admin/games/${game.id}`} key={game.id}>
                  {game.name}
                </Settings.Link>
              ))}
              <Settings.Link href={`/admin/games/new?officeid=${office?.id}`} color="primary.10" showChevron={false}>
                Create game
              </Settings.Link>
            </Settings.List>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

AdminPage.Layout = Admin;

export default AdminPage;

export const getServerSideProps = withDashboardAuth(async ({ params }) => {
  if (typeof params?.id !== 'string') {
    return { notFound: true };
  }

  const office = await getOffice(params.id);
  if (!office) return { notFound: true };

  return {
    props: {
      office,
    },
  };
});

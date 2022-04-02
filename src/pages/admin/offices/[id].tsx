import DeleteButton from '@/components/DeleteButton';
import Editable from '@/components/Editable';
import List from '@/components/List';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import PageHeader from '@/components/PageHeader';
import Settings from '@/components/Settings';
import { WEBSITE_URL } from '@/constants';
import { EditableField, withDashboardAuth } from '@/lib/admin';
import { OfficePATCHAPIResponse } from '@/lib/api/handlers/patchOfficeHandler';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import useMediaQuery from '@/lib/useMediaQuery';
import { Button, Container, Input, Select, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { Office } from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { VscAdd } from 'react-icons/vsc';

type AdminPageProps = {
  office: Awaited<ReturnType<typeof getOffice>>;
};
const EDITABLE_FIELDS: EditableField<Office>[] = [
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
  const [editingFieldKey, setEditingFieldKey] = useState<string | null>(null);
  const [response, setResponse] = useState<Office | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const isDesktop = useMediaQuery('md');
  useNavigationState(response?.name || office?.name);

  const handleSaveField: Parameters<typeof Editable>[0]['onSave'] = async ({ id, value }) => {
    setIsLoading(true);
    const res = await axios
      .patch<OfficePATCHAPIResponse>(`/api/offices/${office?.id}`, { [id]: value })
      .then(res => res.data);
    if (res.status === 'ok') {
      setEditingFieldKey(null);
      setResponse(res.data);
    }

    setIsLoading(false);
  };

  const handleDeleteOffice = async () => {
    setIsLoading(true);
    await axios.delete(`/api/offices/${office?.id}`);
    push('/admin');
    setIsLoading(false);
  };

  return (
    <Container maxW="container.lg" pt={NAVBAR_HEIGHT}>
      <PageHeader title={response?.name || office?.name} icon={response?.icon || office?.icon} />
      <Tabs variant={isDesktop ? 'sidebar' : undefined} css={{ '--sidebar-width': '300px' }}>
        <TabList>
          <Tab>Info</Tab>
          <Tab>Games</Tab>
        </TabList>
        <TabPanels pt={4}>
          <TabPanel>
            <Settings.List>
              {EDITABLE_FIELDS.map(field => {
                const value = response?.[field.id] || office?.[field.id];
                return (
                  <Settings.Item key={field.id} label={field.label} htmlFor={field.id}>
                    <Editable
                      id={field.id}
                      value={value}
                      isEditing={editingFieldKey === field.id}
                      onEdit={() => setEditingFieldKey(field.id)}
                      onCancel={() => setEditingFieldKey(null)}
                      onSave={handleSaveField}
                      isDisabled={editingFieldKey === field.id && isLoading}
                      preText={field.preText}
                      // error={'Name is too short.'}
                    >
                      {field.type === 'text' ? (
                        <Input
                          isInvalid={false}
                          fontSize="sm"
                          type="text"
                          name={field.id}
                          defaultValue={value?.toString()}
                          autoComplete="off"
                          autoFocus
                        />
                      ) : field.type === 'select' ? (
                        <Select>
                          {field.options.map(option => (
                            <option key={option}>option</option>
                          ))}
                        </Select>
                      ) : null}
                    </Editable>
                  </Settings.Item>
                );
              })}
              <Settings.Item label="Danger zone">
                <DeleteButton
                  keyword={`I want to delete all games and matches in ${
                    response?.name || office?.name || 'this office'
                  }`}
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

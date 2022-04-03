import PlayerScores from '@/components/admin/PlayerScores/PlayerScores';
import DeleteButton from '@/components/DeleteButton';
import Editable, { EditableInput } from '@/components/Editable';
import EditableSlider from '@/components/Editable/EditableSlider';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import PageHeader from '@/components/PageHeader';
import Settings from '@/components/Settings';
import { EditableField, withDashboardAuth } from '@/lib/admin';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import useMediaQuery from '@/lib/useMediaQuery';
import { Button, Container, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Tooltip } from '@chakra-ui/react';
import { Game, User } from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IoTrashOutline } from 'react-icons/io5';

type AdminPageProps = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const getUser = (id: string) =>
  prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      roleId: true,
      sessions: { select: { id: true } },
      scores: { select: { id: true, points: true, game: { select: { name: true, icon: true } } } },
    },
  });

const AdminPage: NextPage<AdminPageProps> = ({ user }) => {
  const [editingFieldKey, setEditingFieldKey] = useState<string | null>(null);
  const [response, setResponse] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const isDesktop = useMediaQuery('md');
  useNavigationState(response?.name || user?.name || 'User');

  if (!user) return null;

  const EDITABLE_FIELDS: EditableField<Pick<User, 'name'>>[] = [{ id: 'name', label: 'Name', type: 'text' }];

  const handleSaveField = async ({
    id,
    value,
  }: {
    id: EditableField<Game>['id'];
    value: string | number | boolean;
  }) => {
    setIsLoading(true);
    try {
      const res = await axios.patch(`/api/users/${user?.id}`, { [id]: value }).then(res => res.data);
      if (res.status === 'ok') {
        setEditingFieldKey(null);
        setResponse(res.data);
      }
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  const handleDeleteUser = async () => {
    setIsLoading(true);
    await axios.delete(`/api/users/${user?.id}`);
    push('/admin');
    setIsLoading(false);
  };

  return (
    <Container maxW="container.lg" pt={NAVBAR_HEIGHT}>
      <PageHeader title={response?.name || user?.name} />
      <Tabs variant={isDesktop ? 'sidebar' : undefined} css={{ '--sidebar-width': '300px' }}>
        <TabList>
          <Tab>Info</Tab>
          <Tab>Sessions</Tab>
          <Tab>Scores</Tab>
        </TabList>
        <TabPanels pt={4}>
          <TabPanel as={Stack} spacing={8}>
            <Settings.List>
              {EDITABLE_FIELDS.map(field => {
                const value = response?.[field.id] || user?.[field.id];
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
                    >
                      {field.type === 'text' ? (
                        <EditableInput
                          fontSize="sm"
                          type="text"
                          name={field.id}
                          defaultValue={value?.toString()}
                          autoComplete="off"
                          format={field.format}
                          validate={field.validate}
                          autoFocus
                        />
                      ) : field.type === 'number' ? (
                        <EditableSlider
                          name={field.id}
                          min={field.min}
                          max={field.max}
                          defaultValue={value ? +value : undefined}
                        />
                      ) : null}
                    </Editable>
                  </Settings.Item>
                );
              })}
            </Settings.List>

            <Settings.List>
              <Settings.Item label="Danger zone">
                <DeleteButton
                  keyword={`I want to delete ${
                    response?.name || user?.name || 'this user'
                  } with all scores and matches they played`}
                  onDelete={handleDeleteUser}
                >
                  Delete User
                </DeleteButton>
              </Settings.Item>
            </Settings.List>
          </TabPanel>
          <TabPanel>
            <Settings.List>
              {user?.sessions?.map(session => (
                <Settings.Item key={session.id} label={session.id}>
                  <Tooltip label="clear session" placement="top">
                    <Button variant="solid" colorScheme="danger" css={{ aspectRatio: '1' }}>
                      <IoTrashOutline />
                    </Button>
                  </Tooltip>
                </Settings.Item>
              ))}
            </Settings.List>
          </TabPanel>
          <TabPanel>
            <PlayerScores scores={user.scores} />
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
      user: await getUser(params.id),
    },
  };
});

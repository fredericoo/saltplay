import PlayerScores from '@/components/admin/PlayerScores/PlayerScores';
import SettingsGroup from '@/components/admin/SettingsGroup';
import Breadcrumbs from '@/components/Breadcrumbs';
import type { EditableField } from '@/components/Field/types';
import FloatingActionButton from '@/components/FloatingActionButton';
import PlayerAvatar from '@/components/PlayerAvatar';
import SEO from '@/components/SEO';
import Settings from '@/components/Settings';
import { SESSION_MAX_AGE } from '@/constants';
import Admin from '@/layouts/Admin';
import { PageWithLayout } from '@/layouts/types';
import { withDashboardAuth } from '@/lib/admin';
import { SessionDELETEAPIResponse } from '@/lib/api/handlers/session/deleteSessionHandler';
import { patchUserSchemaAdmin } from '@/lib/api/schemas';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { Badge, Button, HStack, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Tooltip } from '@chakra-ui/react';
import { Session, User } from '@prisma/client';
import axios from 'axios';
import { formatRelative, subSeconds } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IoEyeOutline, IoTrashOutline } from 'react-icons/io5';

type AdminPageProps = {
  user: Awaited<ReturnType<typeof getUser>>;
  roles: Awaited<ReturnType<typeof getRoles>>;
};

const getUser = (id: string) =>
  prisma.user
    .findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        image: true,
        sessions: { select: { id: true, expires: true } },
        scores: {
          select: {
            id: true,
            points: true,
            gameid: true,
            game: { select: { name: true, icon: true, office: { select: { name: true } } } },
          },
        },
      },
    })
    .then(user => ({
      ...user,
      sessions: user?.sessions.map(session => ({ ...session, expires: session.expires.toISOString() })),
    }));

const getRoles = () => prisma.role.findMany({ select: { name: true, id: true } });

const AdminPage: PageWithLayout<AdminPageProps> = ({ user, roles }) => {
  const { data: userSession } = useSession();
  const [deletedSessions, setDeletedSessions] = useState<Session['id'][]>([]);
  const { reload } = useRouter();

  useNavigationState(user?.name || 'User');

  if (!user) return null;

  const editableFields: EditableField<User>[] = [
    {
      id: 'roleId',
      label: 'Role',
      readOnly: userSession?.user.id === user.id,
      type: 'select',
      options: roles.map(role => ({ label: role.name, value: role.id })),
    },
  ];

  const handleDeleteSession = async (sessionId: string) => {
    const deleteSession = await axios
      .delete<SessionDELETEAPIResponse>(`/api/sessions/${sessionId}`)
      .then(res => res.data);
    if (deleteSession.status === 'ok') {
      const deletedSessionId = deleteSession.data?.id;
      if (deletedSessionId) {
        setDeletedSessions(sessions => [...sessions, deletedSessionId]);
      }
    }
  };

  const handleSync = async () => {
    const sync = await axios.post(`/api/users/${user.id}/update`).then(res => res.data);
    if (sync.status === 'ok') {
      reload();
    }
  };

  return (
    <Stack spacing={8}>
      <SEO title={user.name || 'User'} />
      <FloatingActionButton
        buttons={[
          {
            label: 'view',
            icon: <IoEyeOutline />,
            colorScheme: 'success',
            href: `/player/${user.id}`,
          },
        ]}
      />
      <Breadcrumbs
        px={2}
        levels={[
          { label: 'Admin', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: user?.name || 'User', href: `/admin/users/${user.id}` },
        ]}
      />
      <HStack spacing={8} p={4}>
        <PlayerAvatar size={16} user={user} />
        <Text noOfLines={1}>{user.name}</Text>
      </HStack>
      <Tabs>
        <TabList>
          <Tab>Info</Tab>
          <Tab>Sessions</Tab>
          <Tab>Scores</Tab>
        </TabList>
        <TabPanels pt={4}>
          <TabPanel as={Stack} spacing={8}>
            <SettingsGroup
              fieldSchema={patchUserSchemaAdmin}
              fields={editableFields}
              data={user}
              saveEndpoint={`/api/users/${user?.id}`}
            />
            <Button colorScheme="success" onClick={handleSync}>
              Sync information with Slack
            </Button>
          </TabPanel>
          <TabPanel>
            <Settings.List>
              {user?.sessions
                ?.filter(session => !deletedSessions.includes(session.id))
                .map(session => {
                  const isThisSession = user.id === userSession?.user.id && session.expires === userSession?.expires;
                  return (
                    <Settings.Item
                      key={session.id}
                      label={
                        <Stack spacing={0}>
                          <Text fontWeight="bold">
                            {session.id}{' '}
                            {isThisSession && (
                              <Badge colorScheme="primary" variant="solid">
                                current session
                              </Badge>
                            )}
                          </Text>
                          <Text fontSize="xs">
                            last used{' '}
                            {formatRelative(subSeconds(new Date(session.expires), SESSION_MAX_AGE), new Date(), {
                              locale: enGB,
                            })}
                          </Text>
                        </Stack>
                      }
                    >
                      <Tooltip label="clear session" placement="top">
                        <Button
                          variant="solid"
                          colorScheme="danger"
                          css={{ aspectRatio: '1' }}
                          isDisabled={isThisSession}
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <IoTrashOutline />
                        </Button>
                      </Tooltip>
                    </Settings.Item>
                  );
                })}
            </Settings.List>
          </TabPanel>
          <TabPanel>{user.scores && <PlayerScores scores={user.scores} />}</TabPanel>
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

  const user = await getUser(params.id);
  const roles = await getRoles();
  if (!user) return { notFound: true };

  return {
    props: {
      user,
      roles,
    },
  };
});

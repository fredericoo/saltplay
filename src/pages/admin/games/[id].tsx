import DeleteButton from '@/components/DeleteButton';
import Editable, { EditableInput } from '@/components/Editable';
import EditableSlider from '@/components/Editable/EditableSlider';
import FlagsSwitch from '@/components/FlagsSwitch';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import PageHeader from '@/components/PageHeader';
import Settings from '@/components/Settings';
import { GAME_FLAGS, WEBSITE_URL } from '@/constants';
import { EditableField, withDashboardAuth } from '@/lib/admin';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { toSlug, validateSlug } from '@/lib/slug';
import useMediaQuery from '@/lib/useMediaQuery';
import { Container, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { Game } from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

type AdminPageProps = {
  game: Awaited<ReturnType<typeof getGame>>;
};

export const getGame = (id: string) =>
  prisma.game.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      icon: true,
      slug: true,
      flags: true,
      maxPlayersPerTeam: true,
      officeid: true,
      office: { select: { slug: true } },
    },
  });

const AdminPage: NextPage<AdminPageProps> = ({ game }) => {
  const [editingFieldKey, setEditingFieldKey] = useState<string | null>(null);
  const [response, setResponse] = useState<Game | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const isDesktop = useMediaQuery('md');
  useNavigationState(response?.name || game?.name);

  const EDITABLE_FIELDS: EditableField<Game>[] = [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'icon', label: 'Icon', type: 'text' },
    {
      id: 'slug',
      label: 'Slug',
      type: 'text',
      preText: WEBSITE_URL + `/${game?.office.slug}/`,
      validate: validateSlug,
      format: toSlug,
    },
    { id: 'maxPlayersPerTeam', type: 'number', min: 1, max: 10, label: 'Max Players Per Team' },
  ];

  const handleSaveField = async ({
    id,
    value,
  }: {
    id: EditableField<Game>['id'];
    value: string | number | boolean;
  }) => {
    setIsLoading(true);
    try {
      const res = await axios.patch(`/api/games/${game?.id}`, { [id]: value }).then(res => res.data);
      if (res.status === 'ok') {
        setEditingFieldKey(null);
        setResponse(res.data);
      }
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  const handleDeleteOffice = async () => {
    setIsLoading(true);
    await axios.delete(`/api/games/${game?.id}`);
    push('/admin');
    setIsLoading(false);
  };

  return (
    <Container maxW="container.lg" pt={NAVBAR_HEIGHT}>
      <PageHeader title={response?.name || game?.name} icon={response?.icon || game?.icon} />
      <Tabs variant={isDesktop ? 'sidebar' : undefined} css={{ '--sidebar-width': '300px' }}>
        <TabList>
          <Tab>Info</Tab>
        </TabList>
        <TabPanels pt={4}>
          <TabPanel as={Stack} spacing={8}>
            <Settings.List>
              {EDITABLE_FIELDS.map(field => {
                const value = response?.[field.id] || game?.[field.id];
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

            <FlagsSwitch
              onChange={async value => await handleSaveField({ id: 'flags', value })}
              label="Game features"
              flags={GAME_FLAGS}
              defaultValue={game?.flags ?? undefined}
            />

            <Settings.List>
              <Settings.Item label="Danger zone">
                <DeleteButton
                  keyword={`I want to delete all matches for ${response?.name || game?.name || 'this game'}`}
                  onDelete={handleDeleteOffice}
                >
                  Delete Game
                </DeleteButton>
              </Settings.Item>
            </Settings.List>
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
      game: await getGame(params.id),
    },
  };
});

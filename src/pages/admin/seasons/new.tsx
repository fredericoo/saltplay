import Breadcrumbs from '@/components/Breadcrumbs';
import Field from '@/components/Field';
import type { EditableField } from '@/components/Field/types';
import Settings from '@/components/Settings';
import { WEBSITE_URL } from '@/constants';
import Admin from '@/layouts/Admin';
import { PageWithLayout } from '@/layouts/types';
import { withDashboardAuth } from '@/lib/admin';
import { SeasonPOSTAPIResponse } from '@/lib/api/handlers/season/postSeasonHandler';
import { patchSeasonSchema, postSeasonSchema } from '@/lib/api/schemas';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { toSlug } from '@/lib/slug';
import { APIError } from '@/lib/types/api';
import { hasKey, WithDatesAsStrings } from '@/lib/types/utils';
import { Box, Button, Stack, Tooltip } from '@chakra-ui/react';
import { Season } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { groupBy } from 'ramda';
import { FormEventHandler, useState } from 'react';
import { InferType, ValidationError } from 'yup';

const getGamesWithOffices = () =>
  prisma.game.findMany({
    select: { id: true, name: true, office: { select: { id: true, name: true } } },
  });

type GamesWithOffices = Awaited<ReturnType<typeof getGamesWithOffices>>;

const groupByOfficeName = groupBy((game: GamesWithOffices[number]) => game.office.name);

type AdminPageProps = {
  gamesWithOffices: GamesWithOffices;
  query: InferType<typeof postSeasonSchema>;
};

const AdminPage: PageWithLayout<AdminPageProps> = ({ gamesWithOffices, query }) => {
  useNavigationState('Create new season');
  const { push } = useRouter();
  const [error, setError] = useState<APIError<Season>>();
  const [isLoading, setIsLoading] = useState(false);

  const editableFields: EditableField<WithDatesAsStrings<Season>>[] = [
    { id: 'name', label: 'Name', type: 'text' },
    {
      id: 'slug',
      label: 'Slug',
      type: 'text',
      prefix: WEBSITE_URL + `/[office]/[game]/`,
      format: toSlug,
    },
    {
      id: 'gameid',
      label: 'Game',
      type: 'select',
      options: Object.fromEntries(
        Object.entries(groupByOfficeName(gamesWithOffices)).map(([officeName, games]) => [
          officeName,
          games.map(game => ({ label: game.name, value: game.id })),
        ])
      ),
    },
    {
      id: 'startDate',
      label: 'Start Date',
      type: 'datetime',
    },
  ];

  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const body = Object.fromEntries(formData);

    setIsLoading(true);
    await postSeasonSchema
      .validate(body, { abortEarly: false })
      .then(async data => {
        await axios
          .post<SeasonPOSTAPIResponse>('/api/seasons', data)
          .then(res => {
            if (res.data.status !== 'ok') throw new Error('Unexpected response');
            setError(undefined);
            push('/admin/seasons/');
          })
          .catch((e: AxiosError) => {
            const response: APIError<Season> = e.response?.data;
            setError(response);
          });
      })
      .catch((err: ValidationError) => {
        const stack = err.inner.map(err => ({
          type: err.type,
          path: err.path as keyof Season,
          message: err.errors.join('; '),
        }));
        const response: APIError<Season> = { status: 'error', stack };
        setError(response);
      });

    setIsLoading(false);
  };

  const prefilledGame = query.gameid ? gamesWithOffices.find(game => game.id === query.gameid) : undefined;

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit}
      pointerEvents={isLoading ? 'none' : undefined}
      opacity={isLoading ? 0.5 : 1}
      spacing={8}
    >
      <Breadcrumbs
        px={2}
        levels={
          prefilledGame
            ? [
                { label: 'Admin', href: '/admin' },
                {
                  label: prefilledGame.office.name,
                  href: `/admin/offices/${prefilledGame.office.id}`,
                },
                {
                  label: prefilledGame.name,
                  href: `/admin/games/${prefilledGame.id}`,
                },
                { label: 'Create season', href: '/admin/seasons/new' },
              ]
            : [
                { label: 'Admin', href: '/admin' },
                {
                  label: 'Seasons',
                  href: '/admin/seasons',
                },
                { label: 'Create season', href: '/admin/seasons/new' },
              ]
        }
      />

      <Settings.List>
        {editableFields.map((field, i) => {
          const fieldError = error?.stack?.find(error => error.path === field.id)?.message;

          return (
            <Settings.Item key={field.id}>
              <Tooltip
                variant="error"
                label={fieldError}
                placement="bottom-start"
                isOpen={!!fieldError}
                offset={[8, -8]}
              >
                <Box flex={1}>
                  <Field
                    field={field}
                    placeholder={field.label}
                    prefix={field.prefix}
                    align="left"
                    value={hasKey(query, field.id) ? query[field.id] : undefined}
                    isInvalid={!!fieldError}
                    autoFocus={i == 0}
                  />
                </Box>
              </Tooltip>
            </Settings.Item>
          );
        })}
      </Settings.List>

      <Button type="submit" w="100%" variant="solid" colorScheme="primary" size="lg">
        Create
      </Button>
    </Stack>
  );
};

AdminPage.Layout = Admin;

export default AdminPage;

export const getServerSideProps = withDashboardAuth(async ({ query }) => {
  const q = (await patchSeasonSchema.validate(query, { abortEarly: false, stripUnknown: true })) || {};

  return {
    props: { gamesWithOffices: await getGamesWithOffices(), query: q },
  };
});

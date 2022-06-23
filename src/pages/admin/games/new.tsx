import Breadcrumbs from '@/components/Breadcrumbs';
import Field from '@/components/Field';
import FlagsSwitch from '@/components/FlagsSwitch';
import Settings from '@/components/Settings';
import { GAME_FLAGS } from '@/constants';
import Admin from '@/layouts/Admin';
import { PageWithLayout } from '@/layouts/types';
import { withDashboardAuth } from '@/lib/admin';
import { GamePOSTAPIResponse } from '@/lib/api/handlers/game/postGameHandler';
import { patchGameSchema, postGameSchema } from '@/lib/api/schemas';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { APIError } from '@/lib/types/api';
import { hasKey } from '@/lib/types/utils';
import { Box, Button, Stack, Tooltip } from '@chakra-ui/react';
import { Game } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { FormEventHandler, useState } from 'react';
import { InferType, ValidationError } from 'yup';
import { getGameFields } from './[id]';

const getOffices = () =>
  prisma.office.findMany({
    select: { id: true, name: true },
  });

type AdminPageProps = { offices: Awaited<ReturnType<typeof getOffices>>; query: InferType<typeof patchGameSchema> };

const AdminPage: PageWithLayout<AdminPageProps> = ({ offices, query }) => {
  useNavigationState('Create new game');
  const { push } = useRouter();
  const [error, setError] = useState<APIError<Game>>();
  const [isLoading, setIsLoading] = useState(false);
  const [flags, setFlags] = useState<number>(0);

  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const body = Object.fromEntries(formData);

    setIsLoading(true);
    await postGameSchema
      .validate(body, { abortEarly: false })
      .then(async data => {
        await axios
          .post<GamePOSTAPIResponse>('/api/games', data)
          .then(res => {
            if (res.data.status !== 'ok') throw new Error('Unexpected response');
            setError(undefined);
            push('/admin/games');
          })
          .catch((e: AxiosError) => {
            const response: APIError<Game> = e.response?.data;
            setError(response);
          });
      })
      .catch((err: ValidationError) => {
        const stack = err.inner.map(err => ({
          type: err.type,
          path: err.path as keyof Game,
          message: err.errors.join('; '),
        }));
        const response: APIError<Game> = { status: 'error', stack };
        setError(response);
      });

    setIsLoading(false);
  };

  const prefilledOffice = query.officeid ? offices.find(office => office.id === query.officeid) : undefined;

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
          prefilledOffice
            ? [
                { label: 'Admin', href: '/admin' },
                { label: 'Offices', href: '/admin/offices' },
                {
                  label: prefilledOffice.name,
                  href: `/admin/offices/${prefilledOffice.id}`,
                },
                { label: 'Create game', href: '/admin/games/new' },
              ]
            : [
                { label: 'Admin', href: '/admin' },
                {
                  label: 'Games',
                  href: '/admin/games',
                },
                { label: 'Create game', href: '/admin/games/new' },
              ]
        }
      />

      <Settings.List>
        {getGameFields({ offices }).map((field, i) => {
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

      <input name={'flags'} type="hidden" value={flags} />
      <FlagsSwitch flags={GAME_FLAGS} label={'Game features'} defaultValue={0} onChange={value => setFlags(value)} />

      <Button type="submit" w="100%" variant="solid" colorScheme="primary" size="lg">
        Create
      </Button>
    </Stack>
  );
};

AdminPage.Layout = Admin;

export default AdminPage;

export const getServerSideProps = withDashboardAuth(async ({ query }) => {
  const q = await patchGameSchema
    .validate(query, { abortEarly: false, stripUnknown: true })
    .then(data => data)
    .catch(() => ({}));

  return {
    props: { offices: await getOffices(), query: q },
  };
});

import Breadcrumbs from '@/components/Breadcrumbs';
import Field from '@/components/Field';
import Settings from '@/components/Settings';
import Admin from '@/layouts/Admin';
import { PageWithLayout } from '@/layouts/types';
import { withDashboardAuth } from '@/lib/admin';
import { OfficePOSTAPIResponse } from '@/lib/api/handlers/office/postOfficeHandler';
import { patchOfficeSchema, postOfficeSchema } from '@/lib/api/schemas';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import { APIError } from '@/lib/types/api';
import { hasKey } from '@/lib/types/utils';
import { Box, Button, Stack, Tooltip } from '@chakra-ui/react';
import { Office } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { FormEventHandler, useState } from 'react';
import { InferType, ValidationError } from 'yup';
import { officeFields } from './[id]';

type AdminPageProps = { query: InferType<typeof patchOfficeSchema> };
const AdminPage: PageWithLayout<AdminPageProps> = ({ query }) => {
  useNavigationState('Create new office');
  const { push } = useRouter();
  const [error, setError] = useState<APIError<Office>>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const body = Object.fromEntries(formData);

    setIsLoading(true);
    await postOfficeSchema
      .validate(body, { abortEarly: false })
      .then(async data => {
        await axios
          .post<OfficePOSTAPIResponse>('/api/offices', data)
          .then(res => {
            if (res.data.status !== 'ok') throw new Error('Unexpected response');
            setError(undefined);
            const createdOfficeId = res.data.data?.id || '';
            push(`/admin/offices/${createdOfficeId}`);
          })
          .catch((e: AxiosError) => {
            const response: APIError<Office> = e.response?.data;
            setError(response);
          });
      })
      .catch((err: ValidationError) => {
        const stack = err.inner.map(err => ({
          type: err.type,
          path: err.path as keyof Office,
          message: err.errors.join('; '),
        }));
        const response: APIError<Office> = { status: 'error', stack };
        setError(response);
      });

    setIsLoading(false);
  };

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
        levels={[
          { label: 'Admin', href: '/admin' },
          { label: 'Offices', href: '/admin/offices' },
          { label: 'Create office', href: '/admin/offices/new' },
        ]}
      />

      <Settings.List>
        {officeFields.map((field, i) => {
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
  const q = await patchOfficeSchema
    .validate(query, { abortEarly: false, stripUnknown: true })
    .then(data => data)
    .catch(() => ({}));

  return {
    props: { query: q },
  };
});

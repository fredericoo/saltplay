import ConfirmButton from '@/components/admin/ConfirmButton';
import type { EditableField } from '@/components/admin/Field/types';
import SettingsGroup from '@/components/admin/SettingsGroup';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import FloatingActionButton from '@/components/shared/FloatingActionButton';
import SEO from '@/components/shared/SEO';
import Settings from '@/components/shared/Settings';
import { WEBSITE_URL } from '@/constants';
import Admin from '@/layouts/Admin';
import type { PageWithLayout } from '@/layouts/types';
import { withDashboardAuth } from '@/lib/admin';
import { patchOfficeSchema } from '@/lib/api/schemas';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { toSlug } from '@/lib/slug';
import { Stack } from '@chakra-ui/react';
import type { Office } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { IoEyeOutline } from 'react-icons/io5';

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

const getOffice = (id: string) =>
  prisma.office.findUnique({
    where: { id },
    select: { id: true, name: true, icon: true, slug: true, games: { select: { id: true, name: true, icon: true } } },
  });

const AdminPage: PageWithLayout<AdminPageProps> = ({ office }) => {
  const { push } = useRouter();
  useNavigationState(office?.name);

  const handleDeleteOffice = async () => {
    await axios.delete(`/api/offices/${office?.id}`);
    push('/admin/offices');
  };

  return (
    <Stack spacing={8}>
      <SEO title={office?.name || 'Office'} />
      <FloatingActionButton
        buttons={[
          {
            label: 'view',
            icon: <IoEyeOutline />,
            colorScheme: 'success',
            href: `/${office?.slug}`,
          },
        ]}
      />
      <Breadcrumbs
        px={2}
        levels={[
          { label: 'Admin', href: '/admin' },
          { label: 'Offices', href: '/admin/offices' },
          ...(office ? [{ label: office?.name, href: `/admin/offices/${office.id}` }] : []),
        ]}
      />

      <SettingsGroup
        fieldSchema={patchOfficeSchema}
        fields={officeFields}
        saveEndpoint={`/api/offices/${office?.id}`}
        data={office}
      />

      <Settings.List label={`Games in ${office?.name || 'this office'}`}>
        {office?.games.map(game => (
          <Settings.Link icon={game.icon ?? undefined} href={`/admin/games/${game.id}`} key={game.id}>
            {game.name}
          </Settings.Link>
        ))}
        <Settings.Link href={`/admin/games/new?officeid=${office?.id}`} highlight showChevron={false}>
          Create game
        </Settings.Link>
      </Settings.List>

      <Settings.List label="Danger zone">
        <Settings.Item label="Delete office and games">
          <ConfirmButton keyword={office?.name.toLowerCase()} onConfirm={handleDeleteOffice}>
            Delete Office
          </ConfirmButton>
        </Settings.Item>
      </Settings.List>
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

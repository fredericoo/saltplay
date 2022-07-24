import OfficeDashboardPage from '@/components/OfficeDashboardPage';
import { PAGE_REVALIDATE_SECONDS } from '@/constants';
import prisma from '@/lib/prisma';
import type { GetStaticPaths, GetStaticProps } from 'next';

const getOfficeBySlug = async (slug: string) =>
  await prisma.office.findUnique({
    where: { slug },
    select: { games: { orderBy: { id: 'asc' }, select: { id: true, name: true } } },
  });

export type OfficeDashboardPageProps = {
  office?: Awaited<ReturnType<typeof getOfficeBySlug>>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const offices = await prisma.office.findMany({
    select: { slug: true },
  });
  return {
    paths: offices.map(office => ({ params: { office: office.slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<OfficeDashboardPageProps> = async ({ params }) => {
  if (typeof params?.office !== 'string') {
    return { props: {} };
  }

  const office = await getOfficeBySlug(params?.office);

  if (!office) {
    return { props: {} };
  }

  return {
    props: {
      office,
      hasNavbar: false,
      containerWidth: 'full',
    },
    revalidate: PAGE_REVALIDATE_SECONDS,
  };
};

export default OfficeDashboardPage;

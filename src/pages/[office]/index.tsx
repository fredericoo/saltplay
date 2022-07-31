import OfficePage from '@/components/OfficePage';
import { PAGE_REVALIDATE_SECONDS } from '@/constants';
import prisma from '@/lib/prisma';
import type { Office } from '@prisma/client';
import type { GetStaticPaths, GetStaticProps } from 'next';

const getOfficeBySlug = async (slug: Office['slug']) =>
  await prisma.office.findUnique({
    where: { slug },
    select: {
      name: true,
      id: true,
      slug: true,
      icon: true,
      games: {
        orderBy: { name: 'asc' },
        select: {
          _count: {
            select: {
              matches: true,
            },
          },
          name: true,
          id: true,
          slug: true,
          icon: true,
        },
      },
    },
  });

export type OfficePageProps = {
  office: NonNullable<Awaited<ReturnType<typeof getOfficeBySlug>>>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const offices = await prisma.office.findMany({
    select: {
      slug: true,
    },
  });
  return {
    paths: offices.map(office => ({ params: { office: office.slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<OfficePageProps> = async ({ params }) => {
  if (typeof params?.office !== 'string') {
    return { notFound: true };
  }

  const office = await getOfficeBySlug(params?.office);

  if (!office || office === null) {
    return { notFound: true };
  }

  return {
    props: {
      office,
    },
    revalidate: PAGE_REVALIDATE_SECONDS,
  };
};

export default OfficePage;

import { Box } from '@chakra-ui/react';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import prisma from '@/lib/prisma';
import { PromiseElement } from '@/lib/types/utils';
import { Sidebar } from '@/components/Sidebar/types';

export const getOfficeBySlug = async (slug: string) =>
  await prisma.office.findUnique({ where: { slug }, include: { games: true } });

type OfficePageProps = {
  office?: PromiseElement<ReturnType<typeof getOfficeBySlug>>;
};

const OfficePage: NextPage<OfficePageProps> = ({ office }) => {
  if (!office) return <Box>404</Box>;

  return null;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const offices = await prisma.office.findMany({
    select: { slug: true },
  });
  return {
    paths: offices.map(office => ({ params: { office: office.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (typeof params?.office !== 'string') {
    return { props: {} };
  }

  const office = await getOfficeBySlug(params?.office);

  if (!office) {
    return { props: {} };
  }

  const sidebar: Sidebar = {
    items: office.games.map(game => ({
      title: game.name,
      href: `/${office.slug}/${game.slug}`,
      icon: game.icon || null,
    })),
  };

  return {
    props: {
      office,
      sidebar,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default OfficePage;

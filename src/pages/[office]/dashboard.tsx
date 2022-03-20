import Leaderboard from '@/components/Leaderboard';
import DashboardLayout from '@/layouts/DashboardLayout';
import { PageWithLayout } from '@/layouts/types';
import prisma from '@/lib/prisma';
import { PromiseElement } from '@/lib/types/utils';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { GetStaticPaths, GetStaticProps } from 'next';

export const getOfficeBySlug = async (slug: string) =>
  await prisma.office.findUnique({
    where: { slug },
    select: { games: { orderBy: { id: 'asc' }, select: { id: true, name: true } } },
  });

type OfficePageProps = {
  office?: PromiseElement<ReturnType<typeof getOfficeBySlug>>;
};

const OfficePage: PageWithLayout<OfficePageProps> = ({ office }) => {
  if (!office) return <Box>404</Box>;

  return (
    <SimpleGrid minChildWidth={'400px'} maxChildWidth={'600px'} gap={4}>
      {office.games.map(game => (
        <Box bg="grey.1" key={game.id} p={4} borderRadius="xl">
          <Text mb={4} fontSize="3xl">
            {game.name}
          </Text>
          <Leaderboard gameId={game.id} hasIcons={false} />
        </Box>
      ))}
    </SimpleGrid>
  );
};

OfficePage.Layout = DashboardLayout;

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

  return {
    props: {
      office,
      hasNavbar: false,
      containerWidth: 'full',
    },
    revalidate: 60 * 60 * 24,
  };
};

export default OfficePage;

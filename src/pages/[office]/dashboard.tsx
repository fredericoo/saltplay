import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import prisma from '@/lib/prisma';
import { PromiseElement } from '@/lib/types/utils';
import Leaderboard from '@/components/Leaderboard';

export const getOfficeBySlug = async (slug: string) =>
  await prisma.office.findUnique({
    where: { slug },
    select: { games: { select: { id: true, name: true } } },
  });

type OfficePageProps = {
  office?: PromiseElement<ReturnType<typeof getOfficeBySlug>>;
};

const OfficePage: NextPage<OfficePageProps> = ({ office }) => {
  if (!office) return <Box>404</Box>;

  return (
    <SimpleGrid minChildWidth={'400px'} maxChildWidth={'600px'} gap={4}>
      {office.games.map(game => (
        <Box bg="gray.50" key={game.id} p={4} borderRadius="xl">
          <Text mb={4} fontSize="3xl">
            {game.name}
          </Text>
          <Leaderboard gameId={game.id} hasIcons={false} />
        </Box>
      ))}
    </SimpleGrid>
  );
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

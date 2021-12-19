import { Box, Container, SimpleGrid } from '@chakra-ui/react';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import prisma from '@/lib/prisma';
import OfficeHeader from '@/components/OfficeHeader';
import { PromiseElement } from '@/lib/types/utils';
import GameThumbnail from '@/components/GameThumbnail';
import { getOfficeBySlug } from '@/lib/queries';

type OfficePageProps = {
  office?: PromiseElement<ReturnType<typeof getOfficeBySlug>>;
};

const OfficePage: NextPage<OfficePageProps> = ({ office }) => {
  if (!office) return <Box>404</Box>;

  return (
    <>
      <OfficeHeader title={office.name} />
      <Container maxW="container.lg" py={8}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
          {office.games.map(game => (
            <GameThumbnail game={game} href={`/${office.slug}/${game.slug}`} key={game.id} />
          ))}
        </SimpleGrid>
      </Container>
    </>
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

  return {
    props: {
      office,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default OfficePage;

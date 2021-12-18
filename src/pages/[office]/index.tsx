import { Box } from '@chakra-ui/react';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import prisma from '@/lib/prisma';
import OfficeHeader from '@/components/OfficeHeader';
import { PromiseElement } from '@/lib/types/utils';

const getOfficeBySlug = async (slug: string) =>
  await prisma.office.findUnique({ where: { slug }, include: { games: true } });

type OfficePageProps = {
  office?: PromiseElement<ReturnType<typeof getOfficeBySlug>>;
};

const OfficePage: NextPage<OfficePageProps> = ({ office }) => {
  if (!office) return <Box>404</Box>;

  return (
    <>
      <OfficeHeader title={office.name} />
      <ul>
        {office.games.map(game => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
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
  if (typeof params?.office === 'string') {
    const slug = params?.office;
    const office = await getOfficeBySlug(slug);

    return {
      props: {
        office,
      },
      revalidate: 60 * 60 * 24,
    };
  }

  return {
    props: { office: undefined },
  };
};

export default OfficePage;

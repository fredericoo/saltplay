import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import getUserGradient from '@/theme/palettes';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import prisma from '@/lib/prisma';
import { PromiseElement } from '@/lib/types/utils';
import { Sidebar } from '@/components/Sidebar/types';
import SEO from '@/components/SEO';
import useSWR from 'swr';
import fetcher from '@/lib/fetcher';
import Image from 'next/image';
import { RandomPhotoApiResponse } from '../api/photo/random';
import OfficeStat from '@/components/OfficeStat';

export const getOfficeBySlug = async (slug: string) =>
  await prisma.office.findUnique({
    where: { slug },
    select: {
      name: true,
      id: true,
      slug: true,
      games: { orderBy: { id: 'asc' }, select: { name: true, id: true, slug: true, icon: true } },
    },
  });

type OfficePageProps = {
  office?: PromiseElement<ReturnType<typeof getOfficeBySlug>>;
};

const OfficePage: NextPage<OfficePageProps> = ({ office }) => {
  const { data } = useSWR<RandomPhotoApiResponse>(office ? `/api/photo/random?q=${office.name}` : null, fetcher);
  if (!office) return <Box>404</Box>;

  return (
    <Box>
      <SEO title={office.name} />
      <Box bg={getUserGradient(office.id.toString())} borderRadius="xl" overflow="hidden">
        <Box pb={{ base: '50%', md: '25%' }} position="relative" mixBlendMode="overlay">
          {data?.photo && (
            <Image
              src={data.photo.urls.regular}
              alt={data.photo.alt_description || ''}
              objectFit="cover"
              layout="fill"
              unoptimized
            />
          )}
        </Box>
      </Box>
      <Box py={8}>
        <Text as="h1" fontSize="2rem">
          {office.name} office
        </Text>
      </Box>
      <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap={{ base: 4, md: 8 }}>
        <OfficeStat id={office.id} stat="mostPlayedGame" />
        <OfficeStat id={office.id} stat="matchesCount" />
      </SimpleGrid>
    </Box>
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

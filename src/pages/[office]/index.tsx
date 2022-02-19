import LatestMatches from '@/components/LatestMatches';
import OfficeStat from '@/components/OfficeStat';
import SEO from '@/components/SEO';
import { Sidebar } from '@/components/Sidebar/types';
import { RandomPhotoApiResponse } from '@/lib/api/handlers/getRandomPhotoHandler';
import fetcher from '@/lib/fetcher';
import prisma from '@/lib/prisma';
import { PromiseElement } from '@/lib/types/utils';
import getUserGradient from '@/theme/palettes';
import { Box, HStack, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import useSWR from 'swr';

export const getOfficeBySlug = async (slug: string) =>
  await prisma.office.findUnique({
    where: { slug },
    select: {
      name: true,
      id: true,
      slug: true,
      games: {
        orderBy: { name: 'asc' },
        select: { name: true, id: true, slug: true, icon: true },
      },
    },
  });

type OfficePageProps = {
  office?: PromiseElement<ReturnType<typeof getOfficeBySlug>>;
};

const OfficePage: NextPage<OfficePageProps> = ({ office }) => {
  const { data } = useSWR<RandomPhotoApiResponse>(office ? `/api/photo/random?q=${office.name}` : null, fetcher, {
    revalidateOnFocus: false,
  });
  if (!office) return <Box>404</Box>;

  return (
    <Stack spacing={{ base: 1, md: 0.5 }} maxW="container.sm" mx="auto">
      <SEO title={office.name} />
      <Box bg="gray.50" borderRadius="xl" overflow="hidden">
        <Box bg={getUserGradient(office.id.toString())} pb={{ base: '50%', md: '25%' }} position="relative">
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
        <Box p={4}>
          <Text as="h1" fontSize={'2rem'} letterSpacing="tight" mt={2} overflow="hidden">
            {office.name} office
          </Text>
        </Box>
      </Box>
      <HStack flexWrap={'wrap'} spacing={{ base: 1, md: 0.5 }} alignItems="stretch">
        <OfficeStat id={office.id} stat="mostPlayedGame" />
        <OfficeStat id={office.id} stat="matchesCount" />
      </HStack>
      <Stack spacing={6} pt={4}>
        <Tabs>
          <TabList mb={8}>
            <Tab>Latest Matches</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LatestMatches />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Stack>
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

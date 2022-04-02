import LatestMatches from '@/components/LatestMatches';
import List from '@/components/List';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import OfficeStat from '@/components/OfficeStat';
import SEO from '@/components/SEO';
import { Sidebar } from '@/components/Sidebar/types';
import { RandomPhotoApiResponse } from '@/lib/api/handlers/getRandomPhotoHandler';
import fetcher from '@/lib/fetcher';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import useMediaQuery from '@/lib/useMediaQuery';
import getUserGradient from '@/theme/palettes';
import { Box, Container, HStack, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { GetServerSideProps, GetStaticPaths, NextPage } from 'next';
import Image from 'next/image';
import useSWR from 'swr';

export const getOfficeBySlug = async (slug: string) =>
  await prisma.office.findUnique({
    where: { slug },
    select: {
      name: true,
      id: true,
      slug: true,
      icon: true,
      games: {
        orderBy: { name: 'asc' },
        select: { name: true, id: true, slug: true, icon: true },
      },
    },
  });

type OfficePageProps = {
  office?: Awaited<ReturnType<typeof getOfficeBySlug>>;
  sidebar?: Sidebar;
};

const OfficePage: NextPage<OfficePageProps> = ({ office, sidebar }) => {
  const isDesktop = useMediaQuery('md');
  const { data } = useSWR<RandomPhotoApiResponse>(office ? `/api/photo/random?q=${office.name}` : null, fetcher, {
    revalidateOnFocus: false,
  });
  useNavigationState(office?.name);
  if (!office) return <Box>404</Box>;

  return (
    <Container maxW="container.sm" pt={NAVBAR_HEIGHT}>
      <Stack spacing={{ base: 1, md: 0.5 }}>
        <SEO title={office.name} />
        <Box bg="grey.1" borderRadius="18" overflow="hidden">
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
          <HStack flexWrap={'wrap'} spacing={{ base: 1, md: 0.5 }} p={1}>
            <OfficeStat id={office.id} stat="mostPlayedGame" />
            <OfficeStat id={office.id} stat="matchesCount" />
          </HStack>
        </Box>
        <Stack spacing={6} pt={4}>
          <Tabs variant={isDesktop ? undefined : 'bottom'} isLazy>
            <TabList>
              <Tab>Games</Tab>
              <Tab>Latest Matches</Tab>
            </TabList>
            <TabPanels>
              <TabPanel pt={6}>
                <List>
                  {sidebar?.items?.map(item => (
                    <List.Item href={item.href} icon={item.icon || undefined} key={item.title}>
                      {item.title}
                    </List.Item>
                  ))}
                </List>
              </TabPanel>
              <TabPanel pt={6}>
                <LatestMatches officeId={office.id} canLoadMore />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Stack>
    </Container>
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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
  };
};

export default OfficePage;

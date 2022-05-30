import FloatingActionButton from '@/components/FloatingActionButton';
import LatestMatches from '@/components/LatestMatches';
import List from '@/components/List';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import SEO from '@/components/SEO';
import Stat from '@/components/Stat';
import { PAGE_REVALIDATE_SECONDS } from '@/constants';
import { RandomPhotoApiResponse } from '@/lib/api/handlers/getRandomPhotoHandler';
import fetcher from '@/lib/fetcher';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import useMediaQuery from '@/lib/useMediaQuery';
import getUserGradient from '@/theme/palettes';
import { Box, Container, Heading, HStack, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { Office } from '@prisma/client';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { VscEdit } from 'react-icons/vsc';
import useSWR from 'swr';

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

type OfficePageProps = {
  office: NonNullable<Awaited<ReturnType<typeof getOfficeBySlug>>>;
};

const OfficePage: NextPage<OfficePageProps> = ({ office }) => {
  const isDesktop = useMediaQuery('md');
  const { data: randomPhoto } = useSWR<RandomPhotoApiResponse>(
    office ? `/api/photo/random?q=${office.name}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const { data: session } = useSession();

  const matchesPerGame = office.games;
  const matchesCount = matchesPerGame?.reduce((acc, cur) => acc + cur._count.matches, 0) || 0;
  const mostPlayedGame =
    matchesPerGame.length > 0
      ? matchesPerGame?.reduce((acc, cur) => {
          if (cur._count.matches > acc._count.matches) return cur;
          return acc;
        })?.name
      : 'None yet';
  const sidebar = {
    items: office.games.map(game => ({
      title: game.name,
      href: `/${office.slug}/${game.slug}`,
      icon: game.icon || null,
    })),
  };
  useNavigationState(office.name);

  return (
    <Container maxW="container.sm" pt={NAVBAR_HEIGHT}>
      <SEO title={office.name} />
      {canViewDashboard(session?.user.roleId) && (
        <FloatingActionButton
          buttons={[{ label: 'edit', icon: <VscEdit />, colorScheme: 'success', href: `/admin/offices/${office.id}` }]}
        />
      )}
      <Stack spacing={{ base: 1, md: 0.5 }}>
        <Box bg="grey.1" borderRadius="18" overflow="hidden">
          <Box bg={getUserGradient(office.id.toString())} pb={{ base: '50%', md: '25%' }} position="relative">
            {randomPhoto?.data?.photo && (
              <Image
                src={randomPhoto.data.photo.urls.regular}
                alt={randomPhoto.data.photo.alt_description || ''}
                objectFit="cover"
                layout="fill"
                priority
                unoptimized
              />
            )}
          </Box>
          <Box p={4}>
            <Heading as="h1" size="lg" mt={2}>
              {office.name} office
            </Heading>
          </Box>
          <HStack flexWrap={'wrap'} spacing={{ base: 1, md: 0.5 }} p={1}>
            <Stat label="Most played game" content={mostPlayedGame} />
            <Stat label="Matches" content={matchesCount} />
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

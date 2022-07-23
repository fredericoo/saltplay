import Leaderboard from '@/components/Leaderboard';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import SEO from '@/components/SEO';
import Stat from '@/components/Stat';
import { PAGE_REVALIDATE_SECONDS } from '@/constants';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { formatDateTime } from '@/lib/utils';
import { Box, Container, Heading, HStack } from '@chakra-ui/react';
import type { Game, Office, Season } from '@prisma/client';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { object, string } from 'yup';

const getSeason = async (params: { office: Office['slug']; season: Season['slug']; game: Game['id'] }) => {
  const response = await prisma.office.findUnique({
    where: { slug: params.office },
    select: {
      games: {
        where: { slug: params.game },
        select: {
          seasons: {
            where: { slug: params.season },
            select: {
              id: true,
              name: true,
              endDate: true,
              startDate: true,
              colour: true,
              game: {
                select: {
                  name: true,
                  icon: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const season = response?.games[0]?.seasons[0];

  if (!season) return null;

  const seasonWithoutDates = {
    ...season,
    startDate: season?.startDate.toISOString(),
    endDate: season?.endDate?.toISOString() || null,
  };

  return seasonWithoutDates;
};

type SeasonPageProps = {
  season: NonNullable<Awaited<ReturnType<typeof getSeason>>>;
};

const SeasonPage: React.FC<SeasonPageProps> = ({ season }) => {
  useNavigationState(season.name);

  return (
    <Container maxW="container.lg" pt={NAVBAR_HEIGHT}>
      <SEO title={season.name} />
      <Box bg="grey.1" borderRadius="18" overflow="hidden">
        <Box
          bg={season.colour ? `#${season.colour}` : 'grey.10'}
          pb={{ base: '50%', md: '25%' }}
          position="relative"
        ></Box>
        <Box p={4}>
          <Heading as="h1" size="lg" mt={2}>
            {season.game.name}
          </Heading>
        </Box>
        <HStack flexWrap={'wrap'} spacing={{ base: 1, md: 0.5 }} p={1}>
          <Stat label="Started at" content={formatDateTime(new Date(season.startDate))} />
          <Stat label="Matches" content={0} />
        </HStack>
      </Box>
      {season.game && <Leaderboard gameId={season.game.id} seasonId={season.id} />}
    </Container>
  );
};

export default SeasonPage;

export const getStaticPaths: GetStaticPaths = async () => {
  // Deliberately not statically building users.
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<SeasonPageProps> = async ({ params }) => {
  const pageSchema = object({
    office: string().required(),
    game: string().required(),
    season: string().required(),
  });

  return await pageSchema
    .validate(params, { abortEarly: true, stripUnknown: true })
    .then(async params => {
      const season = await getSeason(params);

      if (!season)
        return {
          notFound: true as const,
          revalidate: PAGE_REVALIDATE_SECONDS,
        };

      return {
        props: { season },
        revalidate: PAGE_REVALIDATE_SECONDS,
      };
    })
    .catch(e => {
      console.error(e);
      return {
        notFound: true as const,
        revalidate: PAGE_REVALIDATE_SECONDS,
      };
    });
};

import Leaderboard from '@/components/Leaderboard';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import PageHeader from '@/components/PageHeader';
import SEO from '@/components/SEO';
import { PAGE_REVALIDATE_SECONDS } from '@/constants';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import prisma from '@/lib/prisma';
import { formatDateTime } from '@/lib/utils';
import { Container } from '@chakra-ui/react';
import { Game, Office, Season } from '@prisma/client';
import { GetStaticPaths, GetStaticProps } from 'next';
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
              game: {
                select: {
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

  const seasonWithoutDates = {
    ...season,
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
      <PageHeader
        title={season.name}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore it is actually a string
        subtitle={`finished at ${formatDateTime(new Date(season.endDate), 'Pp')}`}
        icon={season.game?.icon}
      />
      {season.game && <Leaderboard gameId={season.game.id} seasonId={season.id} />}
    </Container>
  );
};

export default SeasonPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const seasons = await prisma.season.findMany({
    select: { slug: true, game: { select: { slug: true, office: { select: { slug: true } } } } },
  });

  return {
    paths: seasons.map(season => ({
      params: {
        season: season.slug,
        game: season.game.slug,
        office: season.game.office.slug,
      },
    })),
    fallback: 'blocking',
  };
};

const pageSchema = object({
  office: string().required(),
  game: string().required(),
  season: string().required(),
});

export const getStaticProps: GetStaticProps<SeasonPageProps> = async ({ params }) => {
  if (process.env.NEXT_PUBLIC_ENABLE_SEASONS !== 'true') return { notFound: true };

  const res = await pageSchema
    .validate(params, { abortEarly: true, stripUnknown: true })
    .then(async params => {
      const season = await getSeason(params);
      if (!season)
        return {
          notFound: true as const,
        };

      return {
        props: { season },
        revalidate: PAGE_REVALIDATE_SECONDS,
      };
    })
    .catch(() => ({
      notFound: true as const,
    }));
  return res;
};

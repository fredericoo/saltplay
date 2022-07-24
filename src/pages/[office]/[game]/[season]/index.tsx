import SeasonPage from '@/components/SeasonPage';
import { PAGE_REVALIDATE_SECONDS } from '@/constants';
import { leaderboardOrderBy } from '@/lib/api/handlers/leaderboard/getLeaderboardHandler';
import prisma from '@/lib/prisma';
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
              scores: {
                take: 3,
                orderBy: leaderboardOrderBy,
                select: {
                  player: {
                    select: {
                      id: true,
                      image: true,
                      name: true,
                      medals: { where: { season: { slug: { equals: params.season } } } },
                    },
                  },
                },
              },
              game: {
                select: {
                  name: true,
                  icon: true,
                  id: true,
                  office: {
                    select: { name: true },
                  },
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

export type SeasonPageProps = {
  season: NonNullable<Awaited<ReturnType<typeof getSeason>>>;
};

export default SeasonPage;

export const getStaticPaths: GetStaticPaths = async () => {
  // Deliberately not statically building seasons.
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

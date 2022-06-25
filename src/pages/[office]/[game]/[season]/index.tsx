import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import { PAGE_REVALIDATE_SECONDS } from '@/constants';
import prisma from '@/lib/prisma';
import { Container } from '@chakra-ui/react';
import { Game, Office, Season } from '@prisma/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import { object, string } from 'yup';

const getSeason = async (params: { office: Office['slug']; season: Season['slug']; game: Game['id'] }) => {
  const res = await prisma.office.findUnique({
    where: { slug: params.office },
    select: {
      games: {
        where: { slug: params.game },
        select: {
          seasons: {
            where: { slug: params.season },
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  return res?.games[0]?.seasons[0];
};

type SeasonPageProps = {
  season: NonNullable<Awaited<ReturnType<typeof getSeason>>>;
};

const SeasonPage: React.FC<SeasonPageProps> = ({ season }) => {
  return (
    <Container maxW="container.lg" pt={NAVBAR_HEIGHT}>
      This page for {season.name} is not ready yet.
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

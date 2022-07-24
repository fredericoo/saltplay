import GamePage from '@/components/GamePage';
import { PAGE_REVALIDATE_SECONDS } from '@/constants';
import prisma from '@/lib/prisma';
import type { Game, Office } from '@prisma/client';
import type { GetStaticPaths, GetStaticProps } from 'next';

const getGame = async (gameSlug: Game['slug'], officeId: Office['id']) => {
  const response = await prisma.game.findUnique({
    where: { slug_officeid: { slug: gameSlug, officeid: officeId } },
    select: {
      office: {
        select: {
          name: true,
          slug: true,
        },
      },
      seasons: {
        select: {
          id: true,
          slug: true,
          name: true,
          startDate: true,
          endDate: true,
          colour: true,
        },
      },
      name: true,
      slug: true,
      icon: true,
      id: true,
      maxPlayersPerTeam: true,
    },
  });
  if (!response) return null;

  const responseWithoutDates = {
    ...response,
    seasons: response.seasons.map(season => ({
      ...season,
      startDate: season.startDate.toISOString(),
      endDate: season.endDate?.toISOString() || null,
    })),
  };

  return responseWithoutDates;
};

export type GamePageProps = {
  game: NonNullable<Awaited<ReturnType<typeof getGame>>>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  // pre-build the most popular 10 games
  const games = await prisma.game.findMany({
    take: 10,
    orderBy: { matches: { _count: 'desc' } },
    select: { slug: true, office: { select: { slug: true } } },
  });

  return {
    paths: games.map(game => ({
      params: {
        game: game.slug,
        office: game.office.slug,
      },
    })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<GamePageProps> = async ({ params }) => {
  if (typeof params?.office !== 'string' || typeof params?.game !== 'string') {
    return {
      notFound: true,
    };
  }

  const office = await prisma.office.findUnique({ where: { slug: params.office }, select: { id: true } });
  if (!office)
    return {
      notFound: true,
    };

  const game = await getGame(params.game, office.id);

  if (!game)
    return {
      notFound: true,
    };

  return {
    props: {
      game,
    },
    revalidate: PAGE_REVALIDATE_SECONDS,
  };
};

export default GamePage;

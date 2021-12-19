import prisma from '@/lib/prisma';
import { PromiseElement } from '@/lib/types/utils';
import { Game } from '@prisma/client';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

export const getOfficeWithGame = async (officeSlug: string, gameSlug: string) =>
  await prisma.office.findUnique({
    where: { slug: officeSlug },
    select: {
      name: true,
      games: {
        where: { slug: gameSlug },
        select: {
          name: true,
          matches: true,
        },
      },
    },
  });

type GamePageProps = {
  office?: PromiseElement<ReturnType<typeof getOfficeWithGame>>;
};

const GamePage: NextPage<GamePageProps> = ({ office }) => {
  const [game] = office?.games ?? [];

  return (
    <div>
      <p>
        {game.name} at the {office?.name} office
      </p>
      <p>{game.matches.length} matches</p>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const offices = await prisma.office.findMany({
    include: { games: true },
  });
  return {
    paths: offices
      .map(office => office.games.map(game => ({ params: { office: office.slug, game: game.slug } })))
      .flat(),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (typeof params?.office !== 'string' || typeof params?.game !== 'string') {
    return {
      props: {},
    };
  }

  const office = await getOfficeWithGame(params.office, params.game);

  return {
    props: {
      office,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default GamePage;

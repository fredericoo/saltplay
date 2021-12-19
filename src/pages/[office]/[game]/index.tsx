import prisma from '@/lib/prisma';
import { getOfficeBySlug } from '@/lib/queries';
import { PromiseElement } from '@/lib/types/utils';
import { Game } from '@prisma/client';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

type GamePageProps = {
  office?: PromiseElement<ReturnType<typeof getOfficeBySlug>>;
  game?: Game;
};

const GamePage: NextPage<GamePageProps> = ({ office, game }) => {
  return (
    <div>
      {game?.name} at the {office?.name} office
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

  const office = await getOfficeBySlug(params.office);
  const game = office?.games.find(game => game.slug === params.game);

  return {
    props: {
      office,
      game,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default GamePage;

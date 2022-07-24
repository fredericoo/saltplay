import PlayerPage from '@/components/PlayerPage';
import { PAGE_REVALIDATE_SECONDS } from '@/constants';
import prisma from '@/lib/prisma';
import type { Game, User } from '@prisma/client';
import type { GetStaticPaths, GetStaticProps } from 'next';

const getPlayerById = async (id: User['id']) =>
  await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      roleId: true,
      leftmatches: { select: { leftscore: true, rightscore: true } },
      rightmatches: { select: { leftscore: true, rightscore: true } },
      scores: {
        distinct: 'gameid',
        select: {
          game: {
            select: {
              id: true,
              name: true,
              icon: true,
              office: {
                select: { icon: true },
              },
            },
          },
        },
      },
    },
  });

export type PlayerPageProps = {
  player: Omit<NonNullable<Awaited<ReturnType<typeof getPlayerById>>>, 'leftmatches' | 'rightmatches' | 'scores'>;
  stats: {
    played: number;
    won: number;
    lost: number;
    games: Pick<Game, 'id' | 'name' | 'icon'>[];
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Deliberately not statically building users.
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<PlayerPageProps> = async ({ params }) => {
  if (typeof params?.id !== 'string') {
    return { notFound: true };
  }

  const fullPlayer = await getPlayerById(params?.id);
  if (!fullPlayer) return { notFound: true };

  const { leftmatches, rightmatches, scores, ...player } = fullPlayer;

  const played = leftmatches.length + rightmatches.length;
  const won =
    leftmatches.reduce((acc, match) => (match.leftscore > match.rightscore ? acc + 1 : acc), 0) +
    rightmatches.reduce((acc, match) => (match.rightscore > match.leftscore ? acc + 1 : acc), 0);
  const lost =
    leftmatches.reduce((acc, match) => (match.leftscore < match.rightscore ? acc + 1 : acc), 0) +
    rightmatches.reduce((acc, match) => (match.rightscore < match.leftscore ? acc + 1 : acc), 0);

  const games = scores.map(score => score.game);

  return {
    props: {
      player,
      stats: {
        played,
        won,
        lost,
        games: games.map(game => ({ name: game.name, icon: [game.office.icon, game.icon].join(' '), id: game.id })),
      },
    },
    revalidate: PAGE_REVALIDATE_SECONDS,
  };
};

export default PlayerPage;

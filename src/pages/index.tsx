import HomePage from '@/components/HomePage';
import { getMostRecentGame, getOffices, getPlayerSample } from '@/lib/home';
import type { GetStaticProps } from 'next';

export type HomePageProps = {
  offices: Awaited<ReturnType<typeof getOffices>>;
  players: Awaited<ReturnType<typeof getPlayerSample>>;
  mostRecentGame: Awaited<ReturnType<typeof getMostRecentGame>>;
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const offices = await getOffices();
  const players = await getPlayerSample();
  const mostRecentGame = await getMostRecentGame();

  return {
    props: { offices, players, mostRecentGame },
    revalidate: 600,
  };
};

export default HomePage;

import { Game } from '@prisma/client';
import MatchSummary from '@/components/MatchSummary/MatchSummary';
import fetcher from '@/lib/fetcher';
import { Button, Center, Stack } from '@chakra-ui/react';
import useSWRInfinite from 'swr/infinite';
import { GameMatchesAPIResponse } from '@/pages/api/games/[id]/matches';
import LoadingIcon from '../LoadingIcon';
import NewMatchButton from '../NewMatchButton';

type LatestMatchesProps = {
  gameId: Game['id'];
};

const getKey = (gameId?: string) => (pageIndex: number, previousPageData: GameMatchesAPIResponse) => {
  if (previousPageData && !previousPageData.nextCursor) return null; // reached the end
  if (!gameId) return null;
  const appendCursor = pageIndex > 0 ? `?cursor=${previousPageData.nextCursor}` : '';
  return `/api/games/${gameId}/matches${appendCursor}`; // SWR key
};

const LatestMatches: React.VFC<LatestMatchesProps> = ({ gameId }) => {
  const { data, size, setSize, error, mutate } = useSWRInfinite<GameMatchesAPIResponse>(getKey(gameId), fetcher);
  const hasNextPage = data?.[data.length - 1].nextCursor;

  if (error) {
    return <div>Error loading matches</div>;
  }

  if (!data) {
    return (
      <Center>
        <LoadingIcon size={12} color="gray.500" />
      </Center>
    );
  }

  return (
    <Stack gap={3}>
      <NewMatchButton gameId={gameId} onSubmitSuccess={mutate} />
      {data.map(page =>
        page.matches?.map(match => (
          <MatchSummary
            key={match.id}
            createdAt={match.createdAt}
            p1score={match.p1score}
            p1={match.p1}
            p2score={match.p2score}
            p2={match.p2}
          />
        ))
      )}
      {hasNextPage && (
        <Button variant="ghost" onClick={() => setSize(size + 1)}>
          Load more
        </Button>
      )}
    </Stack>
  );
};

export default LatestMatches;

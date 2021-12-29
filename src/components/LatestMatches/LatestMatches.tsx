import { Game } from '@prisma/client';
import MatchSummary from '@/components/MatchSummary/MatchSummary';
import fetcher from '@/lib/fetcher';
import { Box, Button, Center, Stack, Text } from '@chakra-ui/react';
import useSWRInfinite from 'swr/infinite';
import { GameMatchesAPIResponse } from '@/pages/api/games/[id]/matches';
import LoadingIcon from '../LoadingIcon';
import NewMatchButton from '../NewMatchButton';
import { motion } from 'framer-motion';
import { MatchesGETAPIResponse } from '@/pages/api/matches';

const MotionBox = motion(Box);

type LatestMatchesProps = {
  gameId?: Game['id'];
  perPage?: number;
  canLoadMore?: boolean;
};

const getKey =
  (gameId?: Game['id'], perPage?: number) => (pageIndex: number, previousPageData: GameMatchesAPIResponse) => {
    if (previousPageData && !previousPageData.nextCursor) return null; // reached the end

    const baseUrl = gameId ? `/api/games/${gameId}/matches` : '/api/matches';

    const perPageParam = perPage ? `count=${perPage}` : undefined;
    const cursorParam = pageIndex > 0 ? `cursor=${previousPageData.nextCursor}` : '';
    const queryParams = [cursorParam, perPageParam].filter(Boolean).join('&');

    return [baseUrl, queryParams].join('?');
  };

const LatestMatches: React.VFC<LatestMatchesProps> = ({ gameId, perPage, canLoadMore = true }) => {
  const { data, size, setSize, error, mutate, isValidating } = useSWRInfinite<MatchesGETAPIResponse>(
    getKey(gameId, perPage),
    fetcher
  );
  const hasNextPage = data?.[data.length - 1].nextCursor;

  if (error || data?.[0].status === 'error') {
    return (
      <Box p={4} textAlign="center" bg="red.100" borderRadius="xl" color="red.600">
        <Text mb={2}>Error loading matches :(</Text>
        <Button isLoading={isValidating} onClick={() => mutate()}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!data) {
    return (
      <Center>
        <LoadingIcon size={12} color="gray.500" />
      </Center>
    );
  }

  const allMatches = data.flatMap(page => page.matches);

  return (
    <Stack gap={3}>
      {gameId && <NewMatchButton gameId={gameId} onSubmitSuccess={mutate} />}

      {allMatches?.map(match => {
        if (!match) return null;
        return (
          <MotionBox
            layout
            transition={{ duration: 0.3 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            key={match.id}
          >
            <MatchSummary
              createdAt={match.createdAt}
              p1score={match.p1score}
              p1={match.p1}
              p2score={match.p2score}
              p2={match.p2}
              gameName={match?.game?.name}
              officeName={match?.game?.office?.name}
            />
          </MotionBox>
        );
      })}

      {hasNextPage && canLoadMore && (
        <Button variant="ghost" onClick={() => setSize(size + 1)}>
          Load more
        </Button>
      )}
    </Stack>
  );
};

export default LatestMatches;

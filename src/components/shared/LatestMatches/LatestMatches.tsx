import MatchSummary from '@/components/shared/LatestMatches/MatchSummary/MatchSummary';
import { PAGE_SIZE } from '@/constants';
import { Box, Button, Skeleton, Stack, Text } from '@chakra-ui/react';
import type { Game, Office, Season, User } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import useLeaderboard from '../Leaderboard/useLeaderboard';
import useLatestMatches from './useLatestMatches';

const MotionBox = motion(Box);

type LatestMatchesProps = {
  gameId?: Game['id'];
  seasonId?: Season['id'];
  userId?: User['id'];
  officeId?: Office['id'];
  canLoadMore?: boolean;
  canDelete?: boolean;
};

const LatestMatches: React.VFC<LatestMatchesProps> = ({
  gameId,
  seasonId,
  userId,
  officeId,
  canLoadMore = true,
  canDelete = true,
}) => {
  const { mutate: mutateLeaderboard } = useLeaderboard({ gameId, seasonId, userId });
  const {
    data: pages,
    setSize,
    error,
    mutate,
    isValidating,
  } = useLatestMatches({ gameId, seasonId, userId, officeId });
  const loadMoreRef = useRef<HTMLButtonElement>(null);
  const hasNextPage = !!pages?.[pages.length - 1].pageInfo?.nextCursor;

  const refetch = () => {
    mutate();
    mutateLeaderboard();
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '500px',
      threshold: 1,
    };
    const handleObserver: IntersectionObserverCallback = entities => {
      const target = entities[0];
      if (target.isIntersecting) {
        setSize(size => size + 1);
      }
    };
    const observer = new IntersectionObserver(handleObserver, options);
    if (hasNextPage && canLoadMore && loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => observer.disconnect();
  }, [canLoadMore, hasNextPage, setSize, pages]);

  if (error || pages?.some(page => page.status === 'error')) {
    return (
      <Box p={4} textAlign="center" bg="red.100" borderRadius="xl" color="red.600">
        <Text mb={2}>Error loading matches :(</Text>
        <Button isLoading={isValidating} onClick={refetch}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!pages || pages.some(page => page.status !== 'ok'))
    return (
      <Stack>
        {new Array(PAGE_SIZE).fill(0).map((_, i) => (
          <Skeleton key={i} w="100%" h="6rem" borderRadius="xl" />
        ))}
      </Stack>
    );

  const allMatches = pages.flatMap(page => page.data?.matches);

  if (allMatches.length === 0)
    return (
      <Text textAlign="center" color="grey.10" py={8}>
        No matches yet!
      </Text>
    );

  return (
    <Stack gap={3} key={gameId}>
      <AnimatePresence initial={false}>
        {allMatches?.map(match => {
          if (!match) return null;
          return (
            <MotionBox
              layout
              transition={{ duration: 0.3 }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              key={match.id}
            >
              <MatchSummary
                id={match.id}
                createdAt={match.createdAt}
                leftscore={match.leftscore}
                left={match.left}
                rightscore={match.rightscore}
                right={match.right}
                gameName={match?.game?.name}
                officeName={match?.game?.office?.name}
                onDelete={canDelete ? refetch : undefined}
                points={match.points}
                seasonId={match.seasonid}
              />
            </MotionBox>
          );
        })}

        {hasNextPage && canLoadMore && (
          <Button
            ref={loadMoreRef}
            key="loadMore"
            isLoading={isValidating}
            variant="subtle"
            colorScheme="grey"
            onClick={() => setSize(size => size + 1)}
          >
            Load more
          </Button>
        )}
      </AnimatePresence>
    </Stack>
  );
};

export default LatestMatches;
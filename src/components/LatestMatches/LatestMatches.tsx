import MatchSummary from '@/components/MatchSummary/MatchSummary';
import { PAGE_SIZE } from '@/lib/constants';
import { Box, Button, Skeleton, Stack, Text } from '@chakra-ui/react';
import { Game, User } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import useLeaderboard from '../Leaderboard/useLeaderboard';
import useLatestMatches from './useLatestMatches';

const MotionBox = motion(Box);

type LatestMatchesProps = {
  gameId?: Game['id'];
  userId?: User['id'];
  canLoadMore?: boolean;
};

const LatestMatches: React.VFC<LatestMatchesProps> = ({ gameId, userId, canLoadMore = true }) => {
  const { mutate: mutateLeaderboard } = useLeaderboard({ gameId });
  const { data, setSize, error, mutate, isValidating } = useLatestMatches({ gameId, userId });

  const hasNextPage = data?.[data.length - 1].nextCursor;

  const refetch = () => {
    mutate();
    mutateLeaderboard();
  };

  if (error || data?.[0].status === 'error') {
    return (
      <Box p={4} textAlign="center" bg="red.100" borderRadius="xl" color="red.600">
        <Text mb={2}>Error loading matches :(</Text>
        <Button isLoading={isValidating} onClick={refetch}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!data)
    return (
      <Stack>
        {new Array(PAGE_SIZE).fill(0).map((_, i) => (
          <Skeleton key={i} w="100%" h="6rem" borderRadius="xl" />
        ))}
      </Stack>
    );

  const allMatches = data.flatMap(page => page.matches);

  if (allMatches.length === 0)
    return (
      <Stack gap={3}>
        <Text textAlign="center" color="gray.500">
          No matches yet!
        </Text>
      </Stack>
    );

  return (
    <Stack gap={3}>
      <AnimatePresence initial={false}>
        {allMatches?.map(match => {
          if (!match) return null;
          const gameName = [match?.game?.icon, match?.game?.name].join(' ');
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
                id={match.id}
                createdAt={match.createdAt}
                leftscore={match.leftscore}
                left={match.left}
                rightscore={match.rightscore}
                right={match.right}
                gameName={gameName}
                officeName={match?.game?.office?.name}
                onDelete={refetch}
                points={match.points}
              />
            </MotionBox>
          );
        })}

        {hasNextPage && canLoadMore && (
          <Button isLoading={isValidating} variant="subtle" onClick={() => setSize(size => size + 1)}>
            Load more
          </Button>
        )}
      </AnimatePresence>
    </Stack>
  );
};

export default LatestMatches;

import { LeaderboardGETAPIResponse } from '@/lib/api/handlers/leaderboard/getLeaderboardHandler';
import { Box, Button, HStack, Skeleton, Stack, Text } from '@chakra-ui/react';
import { Game, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import LeaderboardPosition from './LeaderboardPosition';
import PositionNumber from './PositionNumber';
import useLeaderboard from './useLeaderboard';

type LeaderboardProps = {
  gameId: Game['id'];
  hasIcons?: boolean;
  stickyMe?: boolean;
  bg?: string;
  offsetPlayerBottom?: string;
};

const Leaderboard: React.VFC<LeaderboardProps> = ({ gameId, hasIcons = true, stickyMe, bg, offsetPlayerBottom }) => {
  const { data: session } = useSession();
  const { data: pages, setSize, error, isValidating } = useLeaderboard({ gameId });
  const loadMoreRef = useRef<HTMLButtonElement>(null);
  const hasNextPage = pages?.[pages.length - 1]?.pageInfo?.nextPage;

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
    if (hasNextPage && loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => observer.disconnect();
  }, [hasNextPage, setSize, pages]);

  if (error) return <Box>Error</Box>;
  if (!pages)
    return (
      <Stack>
        {new Array(10).fill(0).map((_, i) => (
          <HStack key={i}>
            <PositionNumber position={i + 1} displayMedals={hasIcons} />
            <Skeleton w="100%" h={i === 0 ? '7rem' : '5rem'} borderRadius="xl" />
          </HStack>
        ))}
      </Stack>
    );

  const allPositions = pages.flatMap(page => page?.data?.positions);

  if (allPositions && allPositions.length === 0)
    return (
      <Text textAlign="center" color="grey.10" py={8}>
        No leaderboard available yet!
      </Text>
    );

  return (
    <Stack>
      {allPositions?.map(player => {
        if (!player) return null;
        const isMe = session?.user.id === player.id;
        return (
          <LeaderboardPosition
            key={player.id}
            user={player}
            hasIcons={hasIcons}
            isMe={isMe}
            bottom={isMe && stickyMe ? offsetPlayerBottom || 0 : undefined}
            bg={bg}
          />
        );
      })}
      {hasNextPage && (
        <Button
          ref={loadMoreRef}
          isLoading={isValidating}
          variant="subtle"
          colorScheme="grey"
          onClick={() => setSize(size => size + 1)}
        >
          Load more
        </Button>
      )}

      {!allPositions.find(position => position?.id === session?.user?.id) && session?.user.id && (
        <PlayerPosition
          id={session.user.id}
          bottom={stickyMe ? offsetPlayerBottom || 0 : undefined}
          gameId={gameId}
          bg={bg}
        />
      )}
    </Stack>
  );
};

const PlayerPosition: React.VFC<{ gameId: Game['id']; bottom?: string | number; id: User['id']; bg?: string }> = ({
  id,
  gameId,
  bottom,
  bg,
}) => {
  const { data: playerPositions } = useSWR<LeaderboardGETAPIResponse>(`/api/leaderboard?gameId=${gameId}&userId=${id}`);
  const player = playerPositions?.data?.positions?.[0];
  if (!player) return null;

  return <LeaderboardPosition key={player.id} user={player} bottom={bottom} isMe bg={bg} />;
};

export default Leaderboard;

import { LeaderboardGETAPIResponse } from '@/lib/api/handlers/getLeaderboardHandler';
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
  const { data, setSize, error, isValidating } = useLeaderboard({ gameId });
  const loadMoreRef = useRef<HTMLButtonElement>(null);
  const hasNextPage = data?.[data.length - 1].nextPage;

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
  }, [hasNextPage, setSize, data]);

  if (error) return <Box>Error</Box>;
  if (!data)
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

  const allPositions = data.flatMap(page => page.positions);

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
            id={player.id}
            key={player.id}
            name={player.name || 'Anonymous'}
            photo={player.image}
            wins={player.wins}
            losses={player.losses}
            points={player.points}
            roleId={player.roleId}
            position={player.position}
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
        <PlayerPosition id={session.user.id} bottom={stickyMe ? offsetPlayerBottom || 0 : undefined} gameId={gameId} />
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
  const player = playerPositions?.positions?.[0];
  if (!player) return null;

  return (
    <LeaderboardPosition
      id={player.id}
      key={player.id}
      name={player.name || 'Anonymous'}
      photo={player.image}
      wins={player.wins}
      losses={player.losses}
      points={player.points}
      roleId={player.roleId}
      position={player.position}
      bottom={bottom}
      isMe
      bg={bg}
    />
  );
};

export default Leaderboard;

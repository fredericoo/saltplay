import PlayerName from '@/components/PlayerName';
import { LeaderboardGETAPIResponse } from '@/lib/api/handlers/getLeaderboardHandler';
import { Badge, Box, Button, HStack, Skeleton, Stack, Text } from '@chakra-ui/react';
import { Game, Role, User } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import PlayerAvatar from '../PlayerAvatar';
import useLeaderboard from './useLeaderboard';

const PositionWrapper = motion(HStack);

type LeaderboardProps = {
  gameId: Game['id'];
  hasIcons?: boolean;
};

const medals: Record<number, string> = {
  0: '🙋',
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

const Leaderboard: React.VFC<LeaderboardProps> = ({ gameId, hasIcons = true }) => {
  const { data: session } = useSession();
  const { data, setSize, error, isValidating } = useLeaderboard({ gameId });
  const hasNextPage = data?.[data.length - 1].nextPage;

  if (error) return <Box>Error</Box>;
  if (!data)
    return (
      <Stack>
        {new Array(10).fill(0).map((_, i) => (
          <HStack key={i}>
            <Box
              textAlign="right"
              w="2.5rem"
              pr={2}
              fontSize="3xl"
              color="gray.400"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {hasIcons && medals[i + 1] ? medals[i + 1] : i + 1}
            </Box>
            <Skeleton w="100%" h={i === 0 ? '7rem' : '5rem'} borderRadius="xl" />
          </HStack>
        ))}
      </Stack>
    );

  const allPositions = data.flatMap(page => page.positions);

  if (allPositions && allPositions.length === 0)
    return (
      <Text textAlign="center" color="gray.500">
        No leaderboard available yet.
      </Text>
    );

  return (
    <Stack>
      <AnimatePresence initial={false}>
        {allPositions?.map(player => {
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
            />
          );
        })}
        {hasNextPage && (
          <Button isLoading={isValidating} variant="subtle" onClick={() => setSize(size => size + 1)}>
            Load more
          </Button>
        )}

        {!allPositions.find(position => position?.id === session?.user?.id) && <PlayerPosition gameId={gameId} />}
      </AnimatePresence>
    </Stack>
  );
};

type LeaderboardPositionProps = {
  id: User['id'];
  position: number;
  roleId: Role['id'];
  name: string;
  photo?: string | null;
  points: number;
  wins?: number;
  losses?: number;
  hasIcons?: boolean;
};

const PlayerPosition: React.VFC<{ gameId: Game['id'] }> = ({ gameId }) => {
  const { data: session } = useSession();
  const { data: playerPositions } = useSWR<LeaderboardGETAPIResponse>(
    `/api/leaderboard?gameId=${gameId}&userId=${session?.user?.id}`
  );
  const playerPosition = playerPositions?.positions?.[0];
  if (!playerPosition) return null;

  return (
    <LeaderboardPosition
      id={playerPosition?.id}
      key={playerPosition?.id}
      name={playerPosition?.name || 'Anonymous'}
      photo={playerPosition?.image}
      wins={playerPosition?.wins}
      losses={playerPosition?.losses}
      points={playerPosition?.points}
      roleId={playerPosition?.roleId}
      position={playerPosition?.position}
    />
  );
};

const LeaderboardPosition: React.VFC<LeaderboardPositionProps> = ({
  id,
  roleId,
  position,
  name,
  photo,
  points,
  wins,
  losses,
  hasIcons = true,
}) => {
  const isFirstPlace = position === 1;
  return (
    <PositionWrapper
      transition={{ duration: 0.3 }}
      layout
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
    >
      <Box textAlign="right" w="2.5rem" pr={2} fontSize="3xl" color="gray.400" whiteSpace="nowrap" overflow="hidden">
        {hasIcons && medals[position] ? medals[position] : position}
      </Box>
      <HStack
        bg="white"
        p={4}
        borderRadius="xl"
        gap={4}
        position="relative"
        boxShadow={isFirstPlace ? '0 32px 64px 0 rgba(0,0,0,0.1)' : undefined}
        zIndex={isFirstPlace ? 1 : undefined}
        w="100%"
        overflow="hidden"
      >
        <PlayerAvatar user={{ id, name, image: photo, roleId }} size={isFirstPlace ? 20 : 12} isLink />
        <Box flexGrow={1}>
          <HStack spacing={1}>
            <PlayerName user={{ name, id, roleId }} noOfLines={1} isLink />
          </HStack>
          <HStack fontSize="sm" color="gray.500">
            <Text>{wins} wins</Text>
            <Text>{losses} losses</Text>
          </HStack>
        </Box>
        <Box>
          <Badge>{points} pts</Badge>
        </Box>
      </HStack>
    </PositionWrapper>
  );
};

export default Leaderboard;

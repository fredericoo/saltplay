import PlayerName from '@/components/PlayerName';
import { LeaderboardGETAPIResponse } from '@/lib/api/handlers/getLeaderboardHandler';
import { Badge, Box, Button, HStack, Skeleton, Stack, Text } from '@chakra-ui/react';
import { Game, Role, User } from '@prisma/client';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import PlayerAvatar from '../PlayerAvatar';
import PointIcon from '../PointIcon';
import PositionNumber from './PositionNumber';
import useLeaderboard from './useLeaderboard';

const PositionWrapper = motion(HStack);

type LeaderboardProps = {
  gameId: Game['id'];
  hasIcons?: boolean;
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
        <Button isLoading={isValidating} variant="subtle" colorScheme="grey" onClick={() => setSize(size => size + 1)}>
          Load more
        </Button>
      )}

      {!allPositions.find(position => position?.id === session?.user?.id) && <PlayerPosition gameId={gameId} />}
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
  const { data: session } = useSession();
  const isMe = session?.user.id === id;
  return (
    <PositionWrapper layout>
      <PositionNumber position={position} displayMedals={hasIcons} />
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
        border="1px solid transparent"
        borderColor={isMe ? 'primary.9' : undefined}
      >
        <PlayerAvatar user={{ id, name, image: photo, roleId }} size={isFirstPlace ? 20 : 12} isLink />
        <Box flexGrow={1}>
          <HStack spacing={1}>
            <PlayerName user={{ name, id, roleId }} noOfLines={1} isLink />
          </HStack>
          <HStack fontSize="sm" color="grey.9">
            <Text>{wins} wins</Text>
            <Text>{losses} losses</Text>
          </HStack>
        </Box>
        <Box>
          <Badge variant="subtle">
            {points} <PointIcon />
          </Badge>
        </Box>
      </HStack>
    </PositionWrapper>
  );
};

export default Leaderboard;

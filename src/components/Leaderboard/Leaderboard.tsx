import PlayerName from '@/components/PlayerName';
import fetcher from '@/lib/fetcher';
import { LeaderboardAPIResponse } from '@/pages/api/games/[id]/leaderboard';
import { Badge, Box, HStack, Skeleton, Stack, Text } from '@chakra-ui/react';
import { Game, Match, Role, User } from '@prisma/client';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import PlayerAvatar from '../PlayerAvatar';

const PositionWrapper = motion(HStack);

type LeaderboardProps = {
  gameId: Game['id'];
  hasIcons?: boolean;
};

const calculateWinsAndLosses = (
  leftMatches: Pick<Match, 'leftscore' | 'rightscore'>[],
  rightMatches: Pick<Match, 'leftscore' | 'rightscore'>[]
) => {
  const p1Stats = leftMatches.reduce(
    (acc, match) => {
      if (match.leftscore > match.rightscore) {
        acc.wins++;
      }
      if (match.leftscore < match.rightscore) {
        acc.losses++;
      }
      return acc;
    },
    { wins: 0, losses: 0 }
  );
  const p2Stats = rightMatches.reduce(
    (acc, match) => {
      if (match.leftscore < match.rightscore) {
        acc.wins++;
      }
      if (match.leftscore > match.rightscore) {
        acc.losses++;
      }
      return acc;
    },
    { wins: 0, losses: 0 }
  );

  return { wins: p1Stats.wins + p2Stats.wins, losses: p1Stats.losses + p2Stats.losses };
};

const medals: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

const Leaderboard: React.VFC<LeaderboardProps> = ({ gameId, hasIcons = true }) => {
  const { data, error } = useSWR<LeaderboardAPIResponse>(`/api/games/${gameId}/leaderboard`, fetcher, {
    refreshInterval: 1000 * 60,
    revalidateOnFocus: false,
  });

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

  if (data.positions && data.positions.length === 0)
    return (
      <Text textAlign="center" color="gray.500">
        No leaderboard available yet.
      </Text>
    );

  return (
    <Stack>
      {data.positions?.map((position, posIndex) => {
        if (!position) return null;
        const stats = calculateWinsAndLosses(position.player.leftmatches, position.player.rightmatches);
        return (
          <PositionWrapper layout key={position.id}>
            <Box
              textAlign="right"
              w="2.5rem"
              pr={2}
              fontSize="3xl"
              color="gray.400"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {hasIcons && medals[posIndex + 1] ? medals[posIndex + 1] : posIndex + 1}
            </Box>
            <LeaderboardPosition
              id={position.player.id}
              key={position.id}
              name={position.player.name || 'Anonymous'}
              photo={position.player.image}
              wins={stats.wins}
              losses={stats.losses}
              points={position.points}
              roleId={position.player.roleId}
              isFirstPlace={posIndex === 0}
            />
          </PositionWrapper>
        );
      })}
    </Stack>
  );
};

type LeaderboardPositionProps = {
  id: User['id'];
  roleId: Role['id'];
  name: string;
  photo?: string | null;
  points: number;
  wins?: number;
  losses?: number;
  isFirstPlace?: boolean;
};

const LeaderboardPosition: React.VFC<LeaderboardPositionProps> = ({
  id,
  roleId,
  name,
  photo,
  points,
  wins,
  losses,
  isFirstPlace,
}) => {
  return (
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
  );
};

export default Leaderboard;

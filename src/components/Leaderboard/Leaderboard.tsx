import fetcher from '@/lib/fetcher';
import { LeaderboardAPIResponse } from '@/pages/api/games/[id]/leaderboard';
import { Badge, Box, Center, Circle, HStack, Stack, Text } from '@chakra-ui/react';
import { Game, Match, User } from '@prisma/client';
import Image from 'next/image';
import useSWRInfinite from 'swr/infinite';
import LoadingIcon from '../LoadingIcon';
import PlayerAvatar from '../PlayerAvatar';
import PlayerLink from '../PlayerLink/PlayerLink';

type LeaderboardProps = {
  gameId: Game['id'];
};

const getKey = (gameId?: string) => (pageIndex: number, previousPageData: LeaderboardAPIResponse) => {
  if (previousPageData && !previousPageData.nextCursor) return null; // reached the end
  if (!gameId) return null;
  const appendCursor = pageIndex > 0 ? `?cursor=${previousPageData.nextCursor}` : '';
  return `/api/games/${gameId}/leaderboard${appendCursor}`; // SWR key
};

const calculateWinsAndLosses = (
  p1Matches: Pick<Match, 'p1score' | 'p2score'>[],
  p2Matches: Pick<Match, 'p1score' | 'p2score'>[]
) => {
  const p1Stats = p1Matches.reduce(
    (acc, match) => {
      if (match.p1score > match.p2score) {
        acc.wins++;
      }
      if (match.p1score < match.p2score) {
        acc.losses++;
      }
      return acc;
    },
    { wins: 0, losses: 0 }
  );
  const p2Stats = p2Matches.reduce(
    (acc, match) => {
      if (match.p1score < match.p2score) {
        acc.wins++;
      }
      if (match.p1score > match.p2score) {
        acc.losses++;
      }
      return acc;
    },
    { wins: 0, losses: 0 }
  );

  return { wins: p1Stats.wins + p2Stats.wins, losses: p1Stats.losses + p2Stats.losses };
};

const Leaderboard: React.VFC<LeaderboardProps> = ({ gameId }) => {
  const { data, size, setSize, error } = useSWRInfinite<LeaderboardAPIResponse>(getKey(gameId), fetcher);
  const hasNextPage = data?.[data.length - 1].nextCursor;

  if (error) return <Box>Error</Box>;
  if (!data)
    return (
      <Center>
        <LoadingIcon size={12} color="gray.500" />
      </Center>
    );

  return (
    <Stack>
      {data.map((page, pageIndex) =>
        page.positions?.map((position, posIndex) => {
          const stats = calculateWinsAndLosses(position.player.p1matches, position.player.p2matches);
          return (
            <LeaderboardPosition
              id={position.player.user.id}
              key={position.id}
              name={position.player.user.name || position.player.user.id}
              photo={position.player.user.image}
              wins={stats.wins}
              losses={stats.losses}
              points={position.points}
              isFirstPlace={posIndex === 0 && pageIndex === 0}
            />
          );
        })
      )}
    </Stack>
  );
};

type LeaderboardPositionProps = {
  id: User['id'];
  name: string;
  photo?: string | null;
  points: number;
  wins?: number;
  losses?: number;
  isFirstPlace?: boolean;
};

const LeaderboardPosition: React.VFC<LeaderboardPositionProps> = ({
  id,
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
      boxShadow={isFirstPlace ? '0 32px 64px 0 rgba(0,0,0,0.15)' : undefined}
      zIndex={isFirstPlace ? 1 : undefined}
      w="100%"
      overflow="hidden"
    >
      <PlayerAvatar name={name} photo={photo} size={isFirstPlace ? 20 : 12} />
      <Box flexGrow={1}>
        <PlayerLink name={`${isFirstPlace ? '🥇 ' : ''}${name}`} id={id} noOfLines={1} />
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
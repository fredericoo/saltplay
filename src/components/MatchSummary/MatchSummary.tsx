import PlayerAvatar from '@/components/PlayerAvatar';
import PlayerName from '@/components/PlayerName';
import canDeleteMatch from '@/lib/canDeleteMatch';
import { getPlayerPointsToMove, getPointsToMove } from '@/lib/points';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { Match, User } from '@prisma/client';
import formatRelative from 'date-fns/formatRelative';
import { enGB } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { Fragment, useState } from 'react';
import DeleteMatchButton from './DeleteButton';
import ScoreTrend from './ScoreTrend';

type MatchSummaryProps = Pick<Match, 'createdAt' | 'rightscore' | 'leftscore' | 'id'> & {
  left: Pick<User, 'name' | 'id' | 'image' | 'roleId'>[];
  right: Pick<User, 'name' | 'id' | 'image' | 'roleId'>[];
  gameName?: string;
  officeName?: string;
  points?: number;
  onDelete?: () => void;
};

const WinnerIcon: React.VFC = () => (
  <Box fontSize="md" as="span">
    🏆
  </Box>
);

const MatchSummary: React.VFC<MatchSummaryProps> = ({
  id,
  createdAt,
  leftscore,
  rightscore,
  left,
  right,
  gameName,
  officeName,
  onDelete,
  points,
}) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const canDelete = onDelete && canDeleteMatch({ user: session?.user, createdAt, players: [...left, ...right] });
  const pointsToMove = !!points
    ? getPointsToMove({ leftLength: left.length, rightLength: right.length, matchPoints: points })
    : undefined;

  return (
    <VStack
      role="group"
      opacity={isLoading ? 0.2 : 1}
      transition="opacity .2s ease-out"
      spacing="0"
      bg="white"
      borderRadius={16}
      px={2}
      position="relative"
      _hover={{ boxShadow: '0px 0px 1px 0 var(--chakra-colors-grey-9)' }}
    >
      {canDelete && (
        <DeleteMatchButton
          id={id}
          onDeleteStart={() => setIsLoading(true)}
          onDeleteError={() => setIsLoading(false)}
          onDeleteSuccess={() => onDelete()}
        />
      )}
      {createdAt && (
        <Box
          color="grey.11"
          textAlign="center"
          bg="white"
          border="1px"
          borderColor="grey.4"
          px={4}
          py={1}
          borderRadius="full"
          position="absolute"
          top="0"
          transform="translateY(-50%)"
          fontSize="xs"
          letterSpacing="wide"
        >
          {formatRelative(new Date(createdAt), new Date(), { locale: enGB })} {officeName && `at ${officeName}`}
        </Box>
      )}
      <HStack p={4} w="100%" justifyContent="center" gap={4}>
        <VStack flex={1} lineHeight={1.2}>
          {left.map(player => (
            <Fragment key={player.id}>
              <PlayerAvatar user={player} isLink />
              <PlayerName
                lineHeight={1.2}
                textAlign="center"
                fontSize="sm"
                user={player}
                maxW="30ch"
                noOfLines={2}
                surnameType="initial"
                isLink
              />
              {!!pointsToMove && (
                <ScoreTrend
                  isPositive={leftscore > rightscore}
                  score={getPlayerPointsToMove({ pointsToMove, teamLength: left.length })}
                />
              )}
            </Fragment>
          ))}
        </VStack>
        <Box flex={1}>
          <HStack justify="center" fontSize="xl">
            <HStack flex={1} justify="flex-end">
              {leftscore > rightscore && <WinnerIcon />}
              <Text>{leftscore}</Text>
            </HStack>
            <Text fontSize="sm" color="grey.9">
              ✕
            </Text>
            <HStack flex={1}>
              <Text>{rightscore}</Text>
              {rightscore > leftscore && <WinnerIcon />}
            </HStack>
          </HStack>
          {gameName && (
            <Text textAlign="center" textTransform="uppercase" fontSize="xs" color="grey.9" letterSpacing="wider">
              {gameName}
            </Text>
          )}
        </Box>
        <VStack flex={1}>
          {right.map(player => (
            <Fragment key={player.id}>
              <PlayerAvatar user={player} isLink />
              <PlayerName
                lineHeight={1.2}
                textAlign="center"
                fontSize="sm"
                user={player}
                maxW="30ch"
                noOfLines={2}
                surnameType="initial"
                isLink
              />
              {!!pointsToMove && (
                <ScoreTrend
                  isPositive={leftscore < rightscore}
                  score={getPlayerPointsToMove({ pointsToMove, teamLength: right.length })}
                />
              )}
            </Fragment>
          ))}
        </VStack>
      </HStack>
    </VStack>
  );
};

export default MatchSummary;

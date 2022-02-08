import PlayerAvatar from '@/components/PlayerAvatar';
import PlayerName from '@/components/PlayerName';
import { MATCH_DELETE_DAYS } from '@/lib/constants';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { Match, User } from '@prisma/client';
import { differenceInDays } from 'date-fns';
import formatRelative from 'date-fns/formatRelative';
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

  return (
    <VStack
      opacity={isLoading ? 0.2 : 1}
      transition="opacity .2s ease-out"
      spacing="0"
      bg="white"
      borderRadius={16}
      px={2}
      position="relative"
    >
      {left.find(player => player.id === session?.user.id) &&
        !(differenceInDays(new Date(), new Date(createdAt)) > MATCH_DELETE_DAYS) && (
          <DeleteMatchButton
            id={id}
            onDeleteStart={() => setIsLoading(true)}
            onDeleteError={() => setIsLoading(false)}
            onDeleteSuccess={() => onDelete?.()}
          />
        )}
      {createdAt && (
        <Box
          color="gray.700"
          textAlign="center"
          bg="white"
          border="1px"
          borderColor="gray.200"
          px={4}
          py={1}
          borderRadius="full"
          position="absolute"
          top="0"
          transform="translateY(-50%)"
          fontSize="xs"
          letterSpacing="wide"
        >
          {formatRelative(new Date(createdAt), new Date())} {officeName && `at ${officeName}`}
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
              {!!points && <ScoreTrend isPositive={leftscore > rightscore} score={points} />}
            </Fragment>
          ))}
        </VStack>
        <Box flex={1}>
          <HStack justify="center" fontSize="xl">
            <HStack flex={1} justify="flex-end">
              {leftscore > rightscore && <WinnerIcon />}
              <Text>{leftscore}</Text>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              ✕
            </Text>
            <HStack flex={1}>
              <Text>{rightscore}</Text>
              {rightscore > leftscore && <WinnerIcon />}
            </HStack>
          </HStack>
          {gameName && (
            <Text textAlign="center" textTransform="uppercase" fontSize="xs" color="gray.400" letterSpacing="wider">
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
              {!!points && <ScoreTrend isPositive={leftscore < rightscore} score={points} />}
            </Fragment>
          ))}
        </VStack>
      </HStack>
    </VStack>
  );
};

export default MatchSummary;

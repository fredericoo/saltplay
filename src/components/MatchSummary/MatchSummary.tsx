import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { Match, User } from '@prisma/client';
import formatRelative from 'date-fns/formatRelative';
import PlayerAvatar from '../PlayerAvatar';
import PlayerLink from '../PlayerLink/PlayerLink';

type MatchSummaryProps = Pick<Match, 'createdAt' | 'p1score' | 'p2score'> & {
  p1: Pick<User, 'name' | 'id' | 'image'>;
  p2: Pick<User, 'name' | 'id' | 'image'>;
  gameName?: string;
  officeName?: string;
};

const WinnerIcon: React.VFC = () => (
  <Box fontSize="md" as="span">
    🏆
  </Box>
);

const MatchSummary: React.VFC<MatchSummaryProps> = ({ createdAt, p1score, p2score, p1, p2, gameName, officeName }) => {
  return (
    <VStack bg="white" borderRadius={16} px={2}>
      {createdAt && (
        <Box
          color="gray.700"
          textAlign="center"
          bg="white"
          border="1px"
          borderColor="gray.300"
          px={4}
          py={1}
          borderRadius="full"
          position="absolute"
          transform="translateY(-50%)"
          fontSize="xs"
          letterSpacing="wide"
        >
          {formatRelative(new Date(createdAt), new Date())} {officeName && `at ${officeName}`}
        </Box>
      )}
      <HStack p={4} w="100%" justifyContent="center" gap={4}>
        <VStack flex={1} lineHeight={1.2}>
          <PlayerAvatar name={p1.name || p1.id} photo={p1.image} />
          <PlayerLink
            lineHeight={1.2}
            textAlign="center"
            fontSize="sm"
            name={p1.name}
            id={p1.id}
            maxW="30ch"
            noOfLines={2}
          />
        </VStack>
        <Box flex={1}>
          <HStack justify="center" fontSize="xl">
            <HStack flex={1} justify="flex-end">
              {p1score > p2score && <WinnerIcon />}
              <Text>{p1score}</Text>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              ✕
            </Text>
            <HStack flex={1}>
              <Text>{p2score}</Text>
              {p2score > p1score && <WinnerIcon />}
            </HStack>
          </HStack>
          {gameName && (
            <Text textAlign="center" fontSize="sm" color="gray.500">
              {gameName}
            </Text>
          )}
        </Box>
        <VStack flex={1}>
          <PlayerAvatar name={p2.name || p2.id} photo={p2.image} />
          <PlayerLink
            lineHeight={1.2}
            textAlign="center"
            fontSize="sm"
            name={p2.name}
            id={p2.id}
            maxW="20ch"
            noOfLines={2}
          />
        </VStack>
      </HStack>
    </VStack>
  );
};

export default MatchSummary;

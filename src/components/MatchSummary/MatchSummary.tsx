import { Box, HStack, VStack, Text, CloseButton } from '@chakra-ui/react';
import { Match, User } from '@prisma/client';
import { match } from 'assert';
import axios from 'axios';
import formatRelative from 'date-fns/formatRelative';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import PlayerAvatar from '../PlayerAvatar';
import PlayerLink from '../PlayerLink/PlayerLink';
import DeleteMatchButton from './DeleteButton';

type MatchSummaryProps = Pick<Match, 'createdAt' | 'p1score' | 'p2score' | 'id'> & {
  p1: Pick<User, 'name' | 'id' | 'image'>;
  p2: Pick<User, 'name' | 'id' | 'image'>;
  gameName?: string;
  officeName?: string;
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
  p1score,
  p2score,
  p1,
  p2,
  gameName,
  officeName,
  onDelete,
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
      {p1.id === session?.user.id && (
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
          <PlayerAvatar user={p1} isLink />
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
          <PlayerAvatar user={p2} isLink />
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

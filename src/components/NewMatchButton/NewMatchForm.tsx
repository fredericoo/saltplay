import fetcher from '@/lib/fetcher';
import { OpponentsAPIResponse } from '@/pages/api/games/[id]/opponents';
import { Badge, Box, Center, HStack, Input, Stack, Text } from '@chakra-ui/react';
import { Game } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useFormContext } from 'react-hook-form';
import useSWR from 'swr';
import LoadingIcon from '../LoadingIcon';
import PlayerAvatar from '../PlayerAvatar';
import PlayerLink from '../PlayerLink/PlayerLink';
import { MatchFormInputs } from './NewMatchButton';
import { groupBy } from 'ramda';
import { ArrayElement } from '@/lib/types/utils';
import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';

type NewMatchFormProps = {
  gameId: Game['id'];
};
type Opponent = ArrayElement<OpponentsAPIResponse['opponents']>;
const byFirstLetter = groupBy<Opponent>(user => user.name?.toLowerCase()[0] || 'other');

const NewMatchForm: React.VFC<NewMatchFormProps> = ({ gameId }) => {
  const { register } = useFormContext<MatchFormInputs>();

  return (
    <Stack>
      <Text>Who have you played against?</Text>
      <PlayerPicker gameId={gameId} />
      <Text pt={8} pb={3}>
        What was the score?
      </Text>
      <HStack>
        <Box flex={1} position="relative">
          <Text
            textAlign="center"
            bg="gray.100"
            borderRadius="full"
            px={3}
            fontSize="sm"
            letterSpacing="wide"
            position="absolute"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex={2}
          >
            You
          </Text>
          <Input
            py={4}
            h="auto"
            fontSize="xl"
            textAlign="center"
            type="number"
            {...register('p1score', { required: true, valueAsNumber: true })}
          />
        </Box>
        <Text>✕</Text>
        <Box flex={1} position="relative">
          <Text
            textAlign="center"
            bg="gray.100"
            borderRadius="full"
            px={3}
            fontSize="sm"
            letterSpacing="wide"
            position="absolute"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex={2}
          >
            Opponent
          </Text>
          <Input
            py={4}
            h="auto"
            fontSize="xl"
            textAlign="center"
            type="number"
            {...register('p2score', { required: true, valueAsNumber: true })}
          />
        </Box>
      </HStack>
    </Stack>
  );
};

type PlayerPickerProps = {
  gameId: Game['id'];
};
const PlayerPicker: React.VFC<PlayerPickerProps> = ({ gameId }) => {
  const { register, watch, setValue } = useFormContext<MatchFormInputs>();
  const { p2id } = watch();
  const { data: opponentsQuery, error: opponentsError } = useSWR<OpponentsAPIResponse>(
    `/api/games/${gameId}/opponents`,
    fetcher
  );
  const { data: session } = useSession();

  const [search, setSearch] = useState<string | null>(null);
  const fuse = new Fuse(opponentsQuery?.opponents || [], {
    keys: ['name'],
    isCaseSensitive: false,
  });

  register('p2id', { required: true });

  if (opponentsError) {
    return <Text>Error loading players</Text>;
  }

  const opponents = search ? fuse.search(search).map(({ item }) => item) : opponentsQuery?.opponents;
  const sortedOpponents =
    opponents
      ?.filter(({ id }) => id !== session?.user.id)
      .sort((a, b) => ((a?.name?.[0] || 'z') > (b?.name?.[0] || 'z') ? 1 : -1)) || [];

  const opponentsByFirstLetter = byFirstLetter(sortedOpponents);

  return (
    <Stack>
      <Input type="text" onChange={e => setSearch(e.target.value)} placeholder="Type to search players" />
      <Box h="256px" overflow="auto" bg="gray.100" borderRadius="xl">
        {opponentsByFirstLetter ? (
          Object.entries(opponentsByFirstLetter).map(([firstLetter, opponents]) => {
            return (
              <Stack key={firstLetter} spacing={0}>
                <Box pl={16} py={1} position="sticky" top="0" zIndex="docked" bg="gray.50" color="gray.600">
                  {firstLetter.toUpperCase()}
                </Box>
                {opponents.map(user => {
                  const [score] = user?.scores;
                  return (
                    <HStack
                      p={4}
                      bg={p2id === user.id ? 'gray.300' : undefined}
                      onClick={() => setValue('p2id', user.id)}
                      key={user.id}
                      as="button"
                      type="button"
                    >
                      <HStack flexGrow={1} spacing={4} flexShrink={1}>
                        <PlayerAvatar user={user} />
                        <PlayerLink name={user.name} noOfLines={1} />
                      </HStack>
                      {score?.points ? <Badge bg={'white'}>{score?.points} pts</Badge> : <Badge>never played</Badge>}
                    </HStack>
                  );
                })}
              </Stack>
            );
          })
        ) : (
          <Center p={8}>
            <LoadingIcon size={8} color="white" />
          </Center>
        )}
      </Box>
    </Stack>
  );
};

export default NewMatchForm;

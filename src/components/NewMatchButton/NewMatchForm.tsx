import fetcher from '@/lib/fetcher';
import { OpponentsAPIResponse } from '@/pages/api/games/[id]/opponents';
import { PlayerPointsAPIResponse } from '@/pages/api/user/points';
import { Badge, Box, HStack, Input, Stack, Text } from '@chakra-ui/react';
import { Game } from '@prisma/client';
import { useFormContext } from 'react-hook-form';
import useSWR from 'swr';
import PlayerAvatar from '../PlayerAvatar';
import PlayerLink from '../PlayerLink/PlayerLink';
import { MatchFormInputs } from './NewMatchButton';

type NewMatchFormProps = {
  gameId: Game['id'];
};

const NewMatchForm: React.VFC<NewMatchFormProps> = ({ gameId }) => {
  const { register } = useFormContext<MatchFormInputs>();

  return (
    <Stack>
      <Text>Who have you played against?</Text>
      <PlayerPicker gameId={gameId} />
      <Text pt={8}>What was the score?</Text>
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
  const { data: pointsQuery } = useSWR<PlayerPointsAPIResponse>('/api/user/points', fetcher);
  const { data: opponentsQuery, error: opponentsError } = useSWR<OpponentsAPIResponse>(
    `/api/games/${gameId}/opponents`,
    fetcher
  );

  register('p2id', { required: true });

  if (opponentsError) {
    return <Text>Error loading players</Text>;
  }

  return (
    <Box>
      <Stack h="256px" overflow="auto" bg="gray.100" borderRadius="16" p={2}>
        {opponentsQuery?.opponents?.map(user => {
          const score = user?.scores[0];
          const hasLowerScore = score && pointsQuery?.points && score.points < pointsQuery.points;
          return (
            <HStack
              bg={p2id === user.id ? 'gray.300' : undefined}
              borderRadius="xl"
              onClick={() => setValue('p2id', user.id)}
              key={user.id}
              as="button"
              type="button"
              p={2}
            >
              <HStack flexGrow={1}>
                <PlayerAvatar photo={user.image} name={user.name} />
                <PlayerLink name={user.name} />
              </HStack>
              <Badge bg={hasLowerScore ? 'orange.100' : 'white'}>{score?.points || 0} pts</Badge>
            </HStack>
          );
        })}
      </Stack>
    </Box>
  );
};

export default NewMatchForm;
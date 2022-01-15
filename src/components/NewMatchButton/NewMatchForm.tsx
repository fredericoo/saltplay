import fetcher from '@/lib/fetcher';
import { OpponentsAPIResponse } from '@/pages/api/games/[id]/opponents';
import { Box, HStack, Input, Stack, Text } from '@chakra-ui/react';
import { Game, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useFormContext } from 'react-hook-form';
import useSWR from 'swr';
import { MatchFormInputs } from './NewMatchButton';
import PlayerPicker from '../PlayerPicker';

type NewMatchFormProps = {
  gameId: Game['id'];
  maxPlayersPerTeam?: Game['maxPlayersPerTeam'];
};

const NewMatchForm: React.VFC<NewMatchFormProps> = ({ gameId, maxPlayersPerTeam = 1 }) => {
  const { register, watch, setValue } = useFormContext<MatchFormInputs>();
  const { data: session } = useSession();
  const {
    data: opponentsQuery,
    error: opponentsError,
    mutate,
  } = useSWR<OpponentsAPIResponse>(`/api/games/${gameId}/opponents`, fetcher);
  register('rightids', { required: true, value: [] });
  const rightids = watch('rightids');
  const players = opponentsQuery?.opponents?.filter(({ id }) => id !== session?.user.id);

  const handleSelect = (id: User['id']) => {
    if (rightids.includes(id)) {
      setValue(
        'rightids',
        rightids.filter(rightid => rightid !== id)
      );
      return;
    }
    if (rightids.length >= (maxPlayersPerTeam || 0)) {
      setValue('rightids', [...rightids.slice(0, -1), id]);
      return;
    }
    setValue('rightids', [...rightids, id]);
  };

  return (
    <Stack>
      <Text>Who have you played against?</Text>
      <PlayerPicker
        players={players}
        selectedIds={rightids}
        refetch={mutate}
        isLoading={!opponentsQuery}
        isError={opponentsError}
        onSelect={handleSelect}
      />
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
            pattern="[0-9]*"
            inputmode="numeric"
            {...register('leftscore', { required: true, valueAsNumber: true })}
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
            pattern="[0-9]*"
            inputmode="numeric"
            {...register('rightscore', { required: true, valueAsNumber: true })}
          />
        </Box>
      </HStack>
    </Stack>
  );
};

export default NewMatchForm;

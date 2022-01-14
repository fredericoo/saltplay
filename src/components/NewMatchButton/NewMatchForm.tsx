import fetcher from '@/lib/fetcher';
import { OpponentsAPIResponse } from '@/pages/api/games/[id]/opponents';
import { Box, HStack, Input, Stack, Text } from '@chakra-ui/react';
import { Game } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useFormContext } from 'react-hook-form';
import useSWR from 'swr';
import { MatchFormInputs } from './NewMatchButton';
import PlayerPicker from '../PlayerPicker';
import InvitePlayer from './InvitePlayer';

type NewMatchFormProps = {
  gameId: Game['id'];
};

const NewMatchForm: React.VFC<NewMatchFormProps> = ({ gameId }) => {
  const { register, watch, setValue } = useFormContext<MatchFormInputs>();
  const { data: session } = useSession();
  const {
    data: opponentsQuery,
    error: opponentsError,
    mutate,
  } = useSWR<OpponentsAPIResponse>(`/api/games/${gameId}/opponents`, fetcher);
  register('p2id', { required: true });
  const p2id = watch('p2id');
  const players = opponentsQuery?.opponents?.filter(({ id }) => id !== session?.user.id);

  return (
    <Stack>
      <Text>Who have you played against?</Text>
      <PlayerPicker
        players={players}
        selectedId={p2id}
        refetch={mutate}
        isLoading={!opponentsQuery}
        onSelect={id => setValue('p2id', id)}
      />
      {/* <InvitePlayer /> */}
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
            pattern="[0-9]*"
            inputmode="numeric"
            {...register('p2score', { required: true, valueAsNumber: true })}
          />
        </Box>
      </HStack>
    </Stack>
  );
};

export default NewMatchForm;

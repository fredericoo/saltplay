import { Badge, Box, HStack, Input, Stack, Text } from '@chakra-ui/react';
import { Game } from '@prisma/client';
import { useFormContext } from 'react-hook-form';
import { MatchFormInputs } from './NewMatchButton';
import Teams from './steps/Teams';

type NewMatchFormProps = {
  gameId: Game['id'];
  maxPlayersPerTeam?: Game['maxPlayersPerTeam'];
};

const NewMatchForm: React.VFC<NewMatchFormProps> = ({ gameId, maxPlayersPerTeam = 1 }) => {
  const { register } = useFormContext<MatchFormInputs>();

  return (
    <Stack>
      <Teams gameId={gameId} maxPlayersPerTeam={maxPlayersPerTeam || 1} />

      <HStack spacing={8} pt={8}>
        <Box flex={1} position="relative">
          <Badge position="absolute" left="50%" transform="translate(-50%, -50%)" zIndex={2}>
            Score
          </Badge>
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
        <Box flex={1} position="relative">
          <Badge position="absolute" left="50%" transform="translate(-50%, -50%)" zIndex={2}>
            Score
          </Badge>
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

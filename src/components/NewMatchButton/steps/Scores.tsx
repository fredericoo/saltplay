import { Badge, Box, HStack, Input } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { MatchFormInputs } from '../NewMatchButton';

const Scores: React.VFC = () => {
  const { register } = useFormContext<MatchFormInputs>();

  return (
    <HStack spacing={8}>
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
  );
};

export default Scores;

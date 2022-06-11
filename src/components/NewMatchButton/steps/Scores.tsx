import { Badge, FormControl, HStack, Input } from '@chakra-ui/react';
import { useFormContext, useFormState } from 'react-hook-form';
import ErrorNotification from '../ErrorNotification';
import { MatchFormInputs } from '../NewMatchButton';

const Scores: React.VFC = () => {
  const { register } = useFormContext<MatchFormInputs>();
  const { errors } = useFormState<MatchFormInputs>();

  return (
    <HStack spacing={8}>
      <FormControl isInvalid={!!errors['leftscore']} flex={1} position="relative">
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
          inputMode="numeric"
          {...register('leftscore', { required: true, valueAsNumber: true })}
        />
        {<ErrorNotification message={errors['leftscore']?.type} />}
      </FormControl>
      <FormControl isInvalid={!!errors['rightscore']} flex={1} position="relative">
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
          inputMode="numeric"
          {...register('rightscore', { required: true, valueAsNumber: true })}
        />
        <ErrorNotification message={errors['rightscore']?.type} />
      </FormControl>
    </HStack>
  );
};

export default Scores;

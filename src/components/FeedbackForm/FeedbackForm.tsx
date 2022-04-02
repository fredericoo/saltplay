import { Button, Center, FormControl, FormHelperText, FormLabel, HStack, Textarea, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import LoadingIcon from '../LoadingIcon';
import { ModalFormProps } from '../ModalButton/ModalButton';

export type FeedbackFormData = {
  rating: number;
  text?: string;
};

const FeedbackForm: React.VFC<ModalFormProps> = ({ closeModal, formId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FeedbackFormData>();
  const toast = useToast();

  register('rating', { required: true, valueAsNumber: true });
  const rating = watch('rating');

  const onSubmit = async (data: FeedbackFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, playerId: session?.user.id }),
      });
      if (!res.ok) throw new Error('Error creating feedback');
      toast({
        title: 'Cheers!',
        status: 'success',
        description: 'Your feedback was sent successfully.',
      });
      reset();
      closeModal();
    } catch (e: unknown) {
      const description = e instanceof Error ? e.message : 'Unknown error';
      toast({
        title: 'Whoops',
        status: 'error',
        description,
      });
      return;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <Center py={16}>
        <LoadingIcon color="grey.4" size={16} />
      </Center>
    );

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)}>
      <FormControl mb={4}>
        <HStack spacing={8} justify="center">
          <Button
            p={8}
            fontSize="2rem"
            variant="solid"
            colorScheme={rating === -1 ? 'danger' : 'grey'}
            onClick={() => setValue('rating', -1)}
          >
            👎
          </Button>
          <Button
            p={8}
            fontSize="2rem"
            variant="solid"
            colorScheme={rating === 1 ? 'success' : 'grey'}
            onClick={() => setValue('rating', 1)}
          >
            👍
          </Button>
        </HStack>
        {errors.rating && (
          <FormHelperText textAlign="center" color="red.500">
            {errors.rating.type}
          </FormHelperText>
        )}
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="text">Message (optional)</FormLabel>
        <Textarea {...register('text')} resize={'vertical'} />
        <FormHelperText>
          {session?.user
            ? `As you're logged in, you’ll be identified as ${session.user.name?.split(' ')[0]}.`
            : `This form will be submitted anonymously.`}
        </FormHelperText>
      </FormControl>
    </form>
  );
};

export default FeedbackForm;

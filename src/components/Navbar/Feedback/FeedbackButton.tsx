import ModalButton from '@/components/shared/ModalButton';
import type { FCC } from '@/types';
import { Box, Text } from '@chakra-ui/react';
import { IoChatbubble } from 'react-icons/io5';
import FeedbackForm from './FeedbackForm';

type FeedbackButtonProps = {};

const FeedbackButton: FCC<FeedbackButtonProps> = () => {
  return (
    <ModalButton
      data-testid="feedback-button"
      bg="transparent"
      modalTitle="How are you enjoying SaltPlay?"
      Form={FeedbackForm}
      sx={{ aspectRatio: { base: '1', md: 'initial' } }}
    >
      <Box fontSize={{ base: 'xl', md: 'md' }} color="grey.10">
        <IoChatbubble />
      </Box>
      <Text ml={2} color="grey.9">
        Feedback
      </Text>
    </ModalButton>
  );
};

export default FeedbackButton;

import { Box, Tooltip } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

type ErrorNotificationProps = {
  message?: string;
};

const MotionBox = motion(Box);

const ErrorNotification: React.VFC<ErrorNotificationProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <Tooltip label={message}>
          <MotionBox
            key={message}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            bg="red.400"
            position="absolute"
            top="-.5rem"
            right="-.5rem"
            w="1rem"
            h="1rem"
            borderRadius="full"
          />
        </Tooltip>
      )}
    </AnimatePresence>
  );
};

export default ErrorNotification;

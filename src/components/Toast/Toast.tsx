import getUserGradient from '@/theme/palettes';
import { Stack, Text } from '@chakra-ui/react';

type ToastProps = {
  status: 'error' | 'success' | 'info';
  heading?: string;
  content?: string;
};

const toastStyles = {
  error: {
    color: getUserGradient('4'),
    shadow:
      '0px 0px 32px rgba(254, 142, 180, 0.1), 0px 8px 16px rgba(254, 142, 180, 0.15), 0px 4px 9px rgba(0, 0, 0, 0.1)',
  },
  success: {
    color: getUserGradient('1'),
    shadow:
      '0px 0px 32px rgba(96, 211, 205, 0.1), 0px 8px 16px rgba(96, 211, 205, 0.15), 0px 4px 9px rgba(0, 0, 0, 0.1)',
  },
  info: {
    color: 'gray.900',
    shadow:
      '0px 0px 32px rgba(126, 128, 134, 0.1), 0px 8px 16px rgba(126, 128, 134, 0.1), 0px 4px 9px rgba(0, 0, 0, 0.1)',
  },
};

const Toast: React.VFC<ToastProps> = ({ status, content, heading }) => {
  return (
    <Stack spacing={2} bg="white" padding="16px" boxShadow={toastStyles[status].shadow} borderRadius="xl">
      <Text fontWeight="bold" bg={toastStyles[status].color} backgroundClip="text">
        {heading}
      </Text>
      {content && <Text color="gray.600">{content}</Text>}
    </Stack>
  );
};

export default Toast;

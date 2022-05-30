import getGradientFromId from '@/theme/palettes';
import { initialColorMode } from '@/theme/theme';
import { Stack, Text, useColorModePreference } from '@chakra-ui/react';

type ToastProps = {
  status: 'error' | 'success' | 'info';
  heading?: string;
  content?: string;
};

const toastStyles = {
  error: {
    color: getGradientFromId('4'),
    bg: { light: 'grey.1', dark: 'danger.12' },
    shadow: {
      light:
        '0px 0px 32px rgba(254, 142, 180, 0.3), 0px 8px 16px rgba(254, 142, 180, 0.4), 0px 4px 9px rgba(0, 0, 0, 0.1)',
      dark: '0 0 1px .5px var(--wrkplay-colors-danger-11)',
    },
  },
  success: {
    color: getGradientFromId('1'),
    bg: { light: 'grey.1', dark: 'success.12' },
    shadow: {
      light:
        '0px 0px 32px rgba(96, 211, 205, 0.3), 0px 8px 16px rgba(96, 211, 205, 0.4), 0px 4px 9px rgba(0, 0, 0, 0.1)',
      dark: '0 0 1px .5px var(--wrkplay-colors-success-11)',
    },
  },
  info: {
    color: 'grey.12',
    bg: { light: 'grey.1', dark: 'grey.12' },
    shadow: {
      light:
        '0px 0px 32px rgba(126, 128, 134, 0.1), 0px 8px 16px rgba(126, 128, 134, 0.1), 0px 4px 9px rgba(0, 0, 0, 0.1)',
      dark: '0 0 1px .5px var(--wrkplay-colors-grey-11)',
    },
  },
};

const Toast: React.VFC<ToastProps> = ({ status, content, heading }) => {
  const mode = useColorModePreference() || initialColorMode;

  return (
    <Stack
      data-testid="modal"
      role="alert"
      spacing={2}
      bg={toastStyles[status].bg[mode]}
      padding="16px"
      boxShadow={toastStyles[status].shadow[mode]}
      borderRadius="xl"
    >
      <Text fontWeight="bold" bg={toastStyles[status].color} backgroundClip="text">
        {heading}
      </Text>
      {content && <Text color="grey.11">{content}</Text>}
    </Stack>
  );
};

export default Toast;

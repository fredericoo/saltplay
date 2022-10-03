import { Box, keyframes } from '@chakra-ui/react';
import { styled } from '@chakra-ui/system';

const fade = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0.1 },
});

const Skeleton = styled(Box, {
  baseStyle: {
    borderRadius: 'sm',
    bg: 'grey.7',
    animation: `0.8s linear infinite alternate ${fade}`,
  },
});

export default Skeleton;

import { Box, keyframes, styled } from '@chakra-ui/react';

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

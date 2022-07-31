import { Box, styled } from '@chakra-ui/react';

const Section = styled(Box, {
  defaultProps: {
    as: 'section',
  },
  baseStyle: {
    py: 4,
    bg: 'grey.4',
    px: 4,
    borderRadius: 'xl',
    position: 'relative',
    overflow: 'hidden',
  },
});

export default Section;

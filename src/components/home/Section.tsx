import { Box, styled } from '@chakra-ui/react';

const Section = styled(Box, {
  baseStyle: {
    py: 4,
    bg: 'grey.4',
    px: 4,
    borderRadius: 'xl',
    position: 'relative',
    overflow: 'hidden',
  },
});
Section.defaultProps = { as: 'section' };

export default Section;

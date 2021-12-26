import { Box, Heading } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageHeader as PageHeaderProps } from './types';

const BlurBox = motion(Box);

const PageHeader: React.VFC<PageHeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <Box position="relative" py={8} zIndex="-1">
      <AnimatePresence>
        <BlurBox
          zIndex={1}
          key={icon}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          userSelect={'none'}
          fontSize="20em"
          position="absolute"
          filter="blur(1em) saturate(200%)"
          left="-.5em"
          top="-1em"
          transform="scaleY(50%)"
        >
          {icon}
        </BlurBox>
      </AnimatePresence>
      <Heading as="h1" size="md">
        {title}
      </Heading>
      <Heading size="md" color="gray.400">
        {subtitle}
      </Heading>
    </Box>
  );
};

export default PageHeader;

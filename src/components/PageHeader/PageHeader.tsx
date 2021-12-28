import { Box, Heading } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import IconBlur from '../IconBlur/IconBlur';
import { PageHeader as PageHeaderProps } from './types';

const BlurBox = motion(Box);

const PageHeader: React.VFC<PageHeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <Box py={8} zIndex="-1" position="relative">
      <AnimatePresence>
        <BlurBox key={icon} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <IconBlur
            zIndex={1}
            icon={icon}
            height="200%"
            opacity={0.25}
            transform={{ base: 'translate(-50%, -50%)', md: 'translate(-50%, -75%)' }}
          />
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

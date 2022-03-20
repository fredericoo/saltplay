import IconBlur from '@/components/IconBlur';
import { Box, Heading } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageHeader as PageHeaderProps } from './types';

const BlurBox = motion(Box);

const PageHeader: React.VFC<PageHeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <Box py={8} position="relative">
      <AnimatePresence>
        <BlurBox key={icon} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <IconBlur
            zIndex={1}
            icon={icon}
            height="200%"
            opacity={0.2}
            transform={{ base: 'translate(-50%, -50%)', md: 'translate(-50%, -75%)' }}
          />
        </BlurBox>
      </AnimatePresence>

      <Heading as="h1" size="md" pl={{ md: 8 }}>
        <Box as="span" w="6">
          {icon}
        </Box>{' '}
        {title}
      </Heading>
      <Heading size="md" color="grey.8" pl={{ base: 6, md: 14 }}>
        {subtitle}
      </Heading>
    </Box>
  );
};

export default PageHeader;

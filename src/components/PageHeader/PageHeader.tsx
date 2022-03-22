import IconBlur from '@/components/IconBlur';
import { Box, Heading } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { forwardRef } from 'react';
import { MotionBox } from '../Motion';
import { PageHeader as PageHeaderProps } from './types';

const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(({ title, subtitle, icon }, ref) => {
  return (
    <Box py={8} position="relative" zIndex={0} ref={ref}>
      <AnimatePresence>
        <MotionBox key={icon} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <IconBlur
            icon={icon}
            height="400%"
            opacity={0.2}
            transform={{ base: 'translate(-50%, -50%)', md: 'translate(-50%, -66%)' }}
          />
        </MotionBox>
      </AnimatePresence>

      <Heading position="relative" as="h1" size="md" pl={{ md: 8 }}>
        <Box as="span" w="6">
          {icon}
        </Box>{' '}
        {title}
      </Heading>
      <Heading position="relative" fontWeight="normal" size="md" color="grey.9" pl={{ base: 6, md: 14 }}>
        {subtitle}
      </Heading>
    </Box>
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;

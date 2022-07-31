import IconBlur from '@/components/shared/IconBlur';
import { Box, Heading, HStack } from '@chakra-ui/react';
import { forwardRef } from 'react';
import type { PageHeader as PageHeaderProps } from './types';

const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(({ title, subtitle, icon }, ref) => {
  return (
    <Box py={8} position="relative" zIndex={0} ref={ref}>
      <IconBlur
        pointerEvents="none"
        icon={icon}
        height="400%"
        opacity={0.2}
        transform={{ base: 'translate(-50%, -50%)', md: 'translate(-50%, -66%)' }}
      />

      <HStack spacing={4} align="baseline">
        <Box fontSize="3xl">{icon}</Box>
        <Box>
          <Heading position="relative" as="h1" size="xl">
            {title}
          </Heading>
          <Heading position="relative" fontWeight="normal" size="md" color="grey.9">
            {subtitle}
          </Heading>
        </Box>
      </HStack>
    </Box>
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;

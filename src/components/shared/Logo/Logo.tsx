import type { ChakraComponent } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import Image from 'next/image';

const Logo: ChakraComponent<'div'> = props => {
  return (
    <Box {...props}>
      <Image src="/wrkplay-icon.png" width="100" height="100" alt="wrkplay" unoptimized />
    </Box>
  );
};

export default Logo;

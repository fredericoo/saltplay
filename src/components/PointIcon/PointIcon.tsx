import { gradientProps } from '@/lib/styleUtils';
import type { ChakraProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

const PointIcon: React.VFC<ChakraProps> = props => {
  return (
    <Box
      w=".75em"
      h=".75em"
      bg={gradientProps}
      display="inline-block"
      borderRadius="25%"
      transform="rotate(-45deg)"
      {...props}
    />
  );
};
export default PointIcon;

import { WEBSITE_URL } from '@/constants';
import { Box } from '@chakra-ui/react';
import QR from 'qrcode.react';
import Logo from '../components/Logo';
import type { LayoutComponent } from './types';

const TV: LayoutComponent = ({ children }) => {
  return (
    <Box as="main" position="relative" h="100vh" overflow="hidden">
      {children}
      <Box position="absolute" bottom="1rem" right="1rem" zIndex="overlay">
        <Box bg="white" position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" p="0.25rem">
          <Logo h="1.5rem" w="1.5rem" />
        </Box>
        <QR renderAs="svg" includeMargin height="12rem" width="12rem" value={WEBSITE_URL} />
      </Box>
    </Box>
  );
};

export default TV;

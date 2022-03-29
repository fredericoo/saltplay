import { Box, useColorModeValue } from '@chakra-ui/react';
import Head from 'next/head';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { LayoutComponent } from './types';

const SimpleLayout: LayoutComponent = ({ children }) => {
  const statusBarStyle = useColorModeValue('default', 'black-translucent');
  return (
    <Box pb={{ base: '96px', md: '0' }}>
      <Head>
        <meta name="apple-mobile-web-app-status-bar-style" content={statusBarStyle} />
      </Head>
      <Navbar />
      {children}
      <Footer />
    </Box>
  );
};

export default SimpleLayout;

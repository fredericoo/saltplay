import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { mauve, mauveDark } from '@radix-ui/colors';
import Head from 'next/head';
import type { LayoutComponent } from './types';

const Default: LayoutComponent = ({ children }) => {
  const statusBarStyle = useColorModeValue('default', 'black-translucent');
  const themeColor = useColorModeValue(mauve.mauve2, mauveDark.mauve2);

  return (
    <Box pb={{ base: '96px', md: '0' }}>
      <Head>
        <meta name="theme-color" content={themeColor} />
        <meta name="apple-mobile-web-app-status-bar-style" content={statusBarStyle} />
      </Head>
      <Navbar />
      {children}
      <Footer />
    </Box>
  );
};

export default Default;

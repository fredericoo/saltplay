import { MotionBox } from '@/components/Motion';
import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import { lastHistoryState } from '@/lib/navigationHistory/state';
import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import { mauve, mauveDark } from '@radix-ui/colors';
import { AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { LayoutComponent } from './types';

const Admin: LayoutComponent = ({ children }) => {
  const statusBarStyle = useColorModeValue('default', 'black-translucent');
  const themeColor = useColorModeValue(mauve.mauve2, mauveDark.mauve2);
  const { pathname } = useRouter();
  const lastHistory = useRecoilValue(lastHistoryState);

  const variants = {
    enter: (path: string) => ({ x: 50 * (lastHistory?.href?.includes(path) ? -1 : 1), opacity: 0 }),
    visible: { x: 0, opacity: 1 },
    exit: (path: string) => {
      console.log(path, pathname, lastHistory);
      return { x: -50 * (lastHistory?.href?.includes(path) ? -1 : 1), opacity: 0 };
    },
  };

  return (
    <Box pb={{ base: '96px', md: '0' }}>
      <Head>
        <meta name="theme-color" content={themeColor} />
        <meta name="apple-mobile-web-app-status-bar-style" content={statusBarStyle} />
      </Head>
      <Navbar />
      <Container maxW="container.sm" display="grid">
        <AnimatePresence initial={false}>
          <MotionBox
            gridColumn="1/2"
            gridRow="1/2"
            custom={pathname}
            key={pathname}
            initial={'enter'}
            animate="visible"
            exit={'exit'}
            variants={variants}
            transition={{ ease: 'easeOut', duration: 0.3 }}
            pt={NAVBAR_HEIGHT}
            mt={8}
          >
            {children}
          </MotionBox>
        </AnimatePresence>
      </Container>
      <Footer />
    </Box>
  );
};

export default Admin;

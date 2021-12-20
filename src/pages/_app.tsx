import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import theme from '@/theme/theme';
import Fonts from '@/theme/Fonts';

const App: React.VFC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <SessionProvider session={session}>
        <Navbar />
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  );
};

export default App;

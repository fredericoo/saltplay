import type { AppProps } from 'next/app';
import { ChakraProvider, VStack } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import theme from '@/theme/theme';
import Fonts from '@/theme/Fonts';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';

const App: React.VFC<AppProps> = ({ Component, pageProps: { session, sidebar, header, ...pageProps } }) => {
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <SessionProvider session={session}>
        <VStack w="100vw" h="100vh">
          <Navbar />
          <Layout sidebar={sidebar}>
            {header && <PageHeader {...header} />}
            <Component {...pageProps} />
          </Layout>
        </VStack>
      </SessionProvider>
    </ChakraProvider>
  );
};

export default App;

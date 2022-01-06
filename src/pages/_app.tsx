import type { AppProps } from 'next/app';
import { ChakraProvider, VStack } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import theme from '@/theme/theme';
import Fonts from '@/theme/Fonts';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

const App: React.VFC<AppProps> = ({
  Component,
  pageProps: { session, sidebar, header, hasNavbar = true, containerWidth, ...pageProps },
}) => {
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <SessionProvider session={session}>
        <VStack w="100vw" h="100vh" spacing={0}>
          {hasNavbar && <Navbar />}
          <Layout sidebar={sidebar} containerWidth={containerWidth}>
            {header && <PageHeader {...header} />}
            <Component {...pageProps} />
          </Layout>
          <Footer />
        </VStack>
      </SessionProvider>
    </ChakraProvider>
  );
};

export default App;

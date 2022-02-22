import Footer from '@/components/Footer';
import Layout from '@/components/Layout';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import fetcher from '@/lib/fetcher';
import Fonts from '@/theme/Fonts';
import theme from '@/theme/theme';
import { ChakraProvider, VStack } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { SWRConfig } from 'swr';

const App: React.VFC<AppProps> = ({
  Component,
  pageProps: { session, sidebar, header, hasNavbar = true, containerWidth, ...pageProps },
}) => {
  return (
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Fonts />
          <SessionProvider session={session}>
            <VStack w="100vw" minH="100vh" spacing={0}>
              {hasNavbar && <Navbar />}
              <Layout sidebar={sidebar} containerWidth={containerWidth}>
                {header && <PageHeader {...header} />}
                <Component {...pageProps} />
              </Layout>
              <Footer />
            </VStack>
          </SessionProvider>
        </ChakraProvider>
      </RecoilRoot>
    </SWRConfig>
  );
};

export default App;

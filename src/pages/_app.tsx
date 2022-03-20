import SimpleLayout from '@/components/Layout/SimpleLayout';
import fetcher from '@/lib/fetcher';
import Fonts from '@/theme/Fonts';
import theme from '@/theme/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { SWRConfig } from 'swr';

const App: React.VFC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const Layout = SimpleLayout;

  return (
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Fonts />
          <SessionProvider session={session}>
            <Layout sidebar={pageProps.sidebar} pageHeader={pageProps.header}>
              <Component {...pageProps} />
            </Layout>
          </SessionProvider>
        </ChakraProvider>
      </RecoilRoot>
    </SWRConfig>
  );
};

export default App;

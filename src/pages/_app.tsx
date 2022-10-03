import Default from '@/layouts/Default';
import type { PageWithLayout } from '@/layouts/types';
import { useMixpanel } from '@/lib/mixpanel';
import Fonts from '@/theme/Fonts';
import GlobalCSS from '@/theme/GlobalCSS';
import theme from '@/theme/theme';
import { ChakraProvider, createLocalStorageManager } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Session } from 'next-auth/core/types';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

type AppComponent = React.FC<AppProps<{ session?: Session | null }> & { Component: PageWithLayout }>;

const colorModeManager = createLocalStorageManager('wrkplay-color-mode');

const queryClient = new QueryClient();

const App: AppComponent = ({ Component, pageProps: { session, ...pageProps } }) => {
  const Layout = Component.Layout || Default;
  useMixpanel();

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <meta
          name="viewport"
          content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
        <Fonts />
        <GlobalCSS />
        <SessionProvider session={session}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;

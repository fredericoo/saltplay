import Default from '@/layouts/Default';
import { PageWithLayout } from '@/layouts/types';
import fetcher from '@/lib/fetcher';
import { useMixpanel } from '@/lib/mixpanel';
import Fonts from '@/theme/Fonts';
import GlobalCSS from '@/theme/GlobalCSS';
import theme from '@/theme/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import NextNProgress from 'nextjs-progressbar';
import { SWRConfig } from 'swr';

type AppComponent = React.VFC<AppProps & { Component: PageWithLayout }>;

const App: AppComponent = ({ Component, pageProps: { session, ...pageProps } }) => {
  const Layout = Component.Layout || Default;
  useMixpanel();

  return (
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
      <Head>
        <meta
          name="viewport"
          content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <ChakraProvider theme={theme}>
        <Fonts />
        <GlobalCSS />
        <SessionProvider session={session}>
          <NextNProgress color="var(--wrkplay-colors-primary-11)" stopDelayMs={0} options={{ showSpinner: false }} />
          <Layout sidebar={pageProps.sidebar}>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </ChakraProvider>
    </SWRConfig>
  );
};

export default App;

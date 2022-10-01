import { initialColorMode } from '@/theme/theme';
import { ColorModeScript } from '@chakra-ui/react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import type { ReactElement } from 'react';

class MyDocument extends Document {
  render(): ReactElement {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="copyright" content="Bruno Campos + Frederico Batista" />

          <meta name="robots" content="index,follow" />
          <meta name="twitter:card" content="summary_large_image" />

          {/* WEB APP */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="wrkplay" />

          <link rel="icon" href="/favicon.png" />
          <link rel="apple-touch-icon" href="/pwa.png" />
        </Head>
        <body>
          <ColorModeScript initialColorMode={initialColorMode} storageKey="wrkplay-color-mode" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

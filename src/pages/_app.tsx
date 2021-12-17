import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

const App: React.VFC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default App;

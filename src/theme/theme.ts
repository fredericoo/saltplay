import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        bg: 'gray.200',
        color: 'gray.900',
      },
    },
  },
  fonts: {
    heading: 'Roobert',
    body: 'Roobert',
  },
  components: {
    Badge: {
      variants: {
        subtle: {
          borderRadius: 'full',
          px: 2,
          py: 0.5,
        },
      },
    },
  },
});

export default theme;

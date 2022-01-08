import { extendTheme } from '@chakra-ui/react';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Menu } from './components/Menu';
import { Modal } from './components/Modal';

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        bg: 'gray.100',
        color: 'gray.900',
      },
      '*': {
        '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
        '-moz-tap-highlight-color': 'rgba(0, 0, 0, 0)',
      },
    },
  },
  fonts: {
    heading: 'Roobert, Helvetica, Arial, sans-serif',
    body: 'Roobert, Helvetica, Arial, sans-serif',
  },
  shadows: {
    outline: '0 0 0 3px rgba(0, 0, 0, 0.1)',
  },
  radii: {
    xl: '16px',
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
    Menu,
    Input,
    Textarea: { ...Input, variants: { custom: Input.variants.custom.field } },
    Button,
    Modal,
  },
});

export default theme;

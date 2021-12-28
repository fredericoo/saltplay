import { extendTheme } from '@chakra-ui/react';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Menu } from './components/Menu';
import { Modal } from './components/Modal';

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
  shadows: {
    outline: '0 0 0 3px rgba(0, 0, 0, 0.1)',
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
    Button,
    Modal,
  },
});

export default theme;

import { extendTheme } from '@chakra-ui/react';
import { amber, crimson, cyan, mauve } from '@radix-ui/colors';
import Badge from './components/Badge';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Menu } from './components/Menu';
import { Modal } from './components/Modal';
import Popover from './components/Popover';
import { Tabs } from './components/Tabs';

const radixToChakraColour = <T extends string>(radixColour: Record<`${T}${number}`, string>, name: T) =>
  Object.fromEntries(Object.entries(radixColour).map(([key, value]) => [key.replace(name, ''), value]));

const theme = extendTheme({
  colors: {
    grey: radixToChakraColour(mauve, 'mauve'),
    primary: radixToChakraColour(crimson, 'crimson'),
    secondary: radixToChakraColour(amber, 'amber'),
    success: radixToChakraColour(cyan, 'cyan'),
    danger: radixToChakraColour(crimson, 'crimson'),
  },
  styles: {
    global: {
      'html, body': {
        bg: 'grey.2',
        color: 'grey.12',
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
    sm: '0px 16px 16px rgba(0, 0, 0, 0.0065), 0px 8px 8px rgba(0, 0, 0, 0.0125), 0px 4px 4px rgba(0, 0, 0, 0.025), 0px 2px 2px rgba(0, 0, 0, 0.05), 0px 1px 1px rgba(0, 0, 0, 0.1)',
    md: '0px 16px 16px rgba(0, 0, 0, 0.0125), 0px 8px 8px rgba(0, 0, 0, 0.025), 0px 4px 4px rgba(0, 0, 0, 0.05), 0px 2px 2px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.2)',
    lg: '0px 16px 16px rgba(0, 0, 0, 0.1), 0px 8px 8px rgba(0, 0, 0, 0.05), 0px 4px 4px rgba(0, 0, 0, 0.025), 0px 2px 2px rgba(0, 0, 0, 0.0125), 0px 1px 1px rgba(0, 0, 0, 0.0075)',
    outline: '0 0 0 3px rgba(0, 0, 0, 0.1)',
  },
  radii: {
    xl: '16px',
  },
  components: {
    CloseButton: {
      baseStyle: {
        borderRadius: 'full',
        color: 'grey.12',
      },
    },
    Badge,
    Popover,
    Menu,
    Input,
    Textarea: { ...Input, variants: { custom: Input.variants.custom.field } },
    Button,
    Modal,
    Tabs,
  },
});

export default theme;

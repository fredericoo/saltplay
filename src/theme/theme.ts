import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import {
  amber,
  amberDark,
  crimson,
  crimsonDark,
  cyan,
  cyanDark,
  mauve,
  mauveDark,
  red,
  redDark,
} from '@radix-ui/colors';
import Badge from './components/Badge';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Menu } from './components/Menu';
import { Modal } from './components/Modal';
import Popover from './components/Popover';
import { Select } from './components/Select';
import { Switch } from './components/Switch';
import { Tabs } from './components/Tabs';
import { Tooltip } from './components/Tooltip';

const radixToChakraColour = <T extends string>(radixColour: Record<`${T}${number}`, string>, name: T) =>
  Object.fromEntries(Object.entries(radixColour).map(([key, value]) => [key.replace(name, ''), value]));

const radixToSemantic = <T extends string>(
  defaultColor: Record<`${T}${number}`, string>,
  darkColor: Record<`${T}${number}`, string>,
  name: T,
  newName: string
) =>
  Object.fromEntries(
    Object.entries(defaultColor).map(([key, value], index) => [
      key.replace(name, newName + '.'),
      { default: value, _dark: darkColor[`${name}${index + 1}`] },
    ])
  );

export const initialColorMode = 'dark';

export const config: ThemeConfig = {
  cssVarPrefix: 'wrkplay',
  initialColorMode,
  useSystemColorMode: false,
};

const theme = extendTheme({
  colors: {
    primary: radixToChakraColour(crimson, 'crimson'),
    primaryDark: radixToChakraColour(crimsonDark, 'crimson'),
    secondary: radixToChakraColour(amber, 'amber'),
    secondaryDark: radixToChakraColour(amberDark, 'amber'),
    success: radixToChakraColour(cyan, 'cyan'),
    successDark: radixToChakraColour(cyanDark, 'cyan'),
    danger: radixToChakraColour(red, 'red'),
    dangerDark: radixToChakraColour(redDark, 'red'),
  },
  semanticTokens: {
    colors: { ...radixToSemantic(mauve, mauveDark, 'mauve', 'grey') },
  },
  config,
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
    soft: '0px 24px 80px rgba(0, 0, 0, 0.06), 0px 12.4857px 29.2013px rgba(0, 0, 0, 0.0413989), 0px 5.92003px 14.1767px rgba(0, 0, 0, 0.0333774), 0px 2.46393px 6.94968px rgba(0, 0, 0, 0.0266226), 0px 0.720165px 2.74791px rgba(0, 0, 0, 0.0186011)',
    outline: '0 0 0 3px var(--wrkplay-colors-grey-6)',
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
    Skeleton: {
      defaultProps: {
        startColor: 'blackAlpha.100',
        endColor: 'blackAlpha.400',
      },
    },
    Tooltip,
    Badge,
    Popover,
    Menu,
    Input,
    Textarea: { ...Input, variants: { custom: Input.variants.default.field } },
    Select,
    Button,
    Modal,
    Switch,
    Tabs,
  },
});

export default theme;

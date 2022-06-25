import type { SystemStyleFunction, SystemStyleObject } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

const variantTransparent: SystemStyleObject = {};

export const variantSubtle: SystemStyleFunction = props => {
  const { colorScheme: c } = props;

  if (c === 'grey')
    return {
      color: mode(`${c}.10`, `${c}.11`)(props),
      bg: mode(`${c}.3`, `${c}.5`)(props),
      _hover: {
        bg: mode(`${c}.4`, `${c}.6`)(props),
      },
      _active: {
        bg: mode(`${c}.5`, `${c}.7`)(props),
      },
      _disabled: {
        pointerEvents: 'none',
      },
    };

  return {
    color: mode(`${c}.10`, `${c}Dark.10`)(props),
    bg: mode(`${c}.3`, `${c}Dark.3`)(props),
    _hover: {
      bg: mode(`${c}.4`, `${c}Dark.4`)(props),
    },
    _active: {
      bg: mode(`${c}.5`, `${c}Dark.5`)(props),
    },
    _disabled: {
      pointerEvents: 'none',
    },
  };
};

const variantSolid: SystemStyleFunction = props => {
  const { colorScheme: c } = props;

  if (c === 'grey')
    return {
      color: mode(`${c}.12`, `${c}.12`)(props),
      bg: `${c}.6`,
      _hover: {
        bg: `${c}.7`,
      },
      _active: {
        bg: `${c}.8`,
      },
      _disabled: {
        pointerEvents: 'none',
      },
    };

  return {
    color: mode(`${c}.1`, `${c}Dark.12`)(props),
    bg: mode(`${c}.9`, `${c}Dark.9`)(props),
    _hover: {
      bg: mode(`${c}.10`, `${c}Dark.10`)(props),
    },
    _active: {
      bg: mode(`${c}.11`, `${c}Dark.11`)(props),
    },
    _disabled: {
      pointerEvents: 'none',
    },
  };
};

const variantPrimary: SystemStyleObject = {
  bg: [
    [
      'linear-gradient(-135deg, #FBB826, #FE33A1)',
      'linear-gradient(-135deg, color(display-p3 1 0.638 0), color(display-p3 1 0 0.574))',
    ],
  ],
  fontWeight: 'bold',
  color: 'white',
  _hover: {
    transform: 'scale(1.02)',
  },
  _active: {
    transform: 'scale(0.98)',
  },
  _disabled: {
    pointerEvents: 'none',
  },
};

export const Button = {
  baseStyle: {
    fontWeight: 400,
  },
  variants: { subtle: variantSubtle, primary: variantPrimary, solid: variantSolid, transparent: variantTransparent },
  sizes: {
    sm: {
      borderRadius: 10,
      py: '.375rem',
      px: '.625rem',
    },
    md: {
      borderRadius: 12,
      py: '.5rem',
      px: '.625rem',
      height: 'auto',
    },
    lg: {
      borderRadius: 16,
      py: '.8rem',
      px: '1.2rem',
      height: 'auto',
    },
  },
  defaultProps: {
    variant: 'subtle',
    colorScheme: 'grey',
  },
};

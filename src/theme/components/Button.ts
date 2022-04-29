import type { SystemStyleFunction, SystemStyleObject } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

const variantSubtle: SystemStyleFunction = props => {
  const { colorScheme: c } = props;

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
};

const variantSolid: SystemStyleFunction = props => {
  const { colorScheme: c } = props;

  return {
    color: mode(`${c}.1`, `${c}.1`)(props),
    bg: `${c}.10`,
    _hover: {
      bg: `${c}.11`,
    },
    _active: {
      bg: `${c}.12`,
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
  variants: { subtle: variantSubtle, primary: variantPrimary, solid: variantSolid },
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

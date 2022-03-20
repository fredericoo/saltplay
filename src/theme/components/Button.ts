import type { SystemStyleFunction, SystemStyleObject } from '@chakra-ui/theme-tools';
import { mode, transparentize } from '@chakra-ui/theme-tools';

const variantSubtle: SystemStyleFunction = props => {
  const { colorScheme: c, theme } = props;

  const darkHoverBg = transparentize(`${c}.2`, 0.12)(theme);
  const darkActiveBg = transparentize(`${c}.2`, 0.24)(theme);

  return {
    color: mode(`${c}.10`, `${c}.1`)(props),
    bg: mode(`${c}.3`, darkHoverBg)(props),
    _hover: {
      bg: mode(`${c}.4`, darkHoverBg)(props),
    },
    _active: {
      bg: mode(`${c}.5`, darkActiveBg)(props),
    },
    _disabled: {
      pointerEvents: 'none',
    },
  };
};

const variantSolid: SystemStyleFunction = props => {
  const { colorScheme: c } = props;

  return {
    color: mode(`${c}.1`, `${c}.12`)(props),
    bg: mode(`${c}.10`, `${c}.3`)(props),
    _hover: {
      bg: mode(`${c}.11`, `${c}.2`)(props),
    },
    _active: {
      bg: mode(`${c}.12`, `${c}.1`)(props),
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
    opacity: 0.7,
  },
  _active: {
    opacity: 1,
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
  },
};

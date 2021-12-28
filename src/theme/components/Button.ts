import { mode, transparentize } from '@chakra-ui/theme-tools';
import type { SystemStyleFunction, SystemStyleObject } from '@chakra-ui/theme-tools';

const variantSubtle: SystemStyleFunction = props => {
  const { colorScheme: c, theme } = props;

  const darkHoverBg = transparentize(`${c}.200`, 0.12)(theme);
  const darkActiveBg = transparentize(`${c}.200`, 0.24)(theme);

  return {
    color: mode(`${c}.600`, `${c}.200`)(props),
    bg: mode(`${c}.50`, darkHoverBg)(props),
    _hover: {
      bg: mode(`${c}.100`, darkHoverBg)(props),
    },
    _active: {
      bg: mode(`${c}.200`, darkActiveBg)(props),
    },
  };
};

const variantPrimary: SystemStyleObject = {
  bg: 'linear-gradient(-135deg, #FBB826, #FE33A1)',
  fontWeight: 'bold',
  color: 'white',
  _hover: {
    opacity: 0.7,
  },
  _active: {
    opacity: 1,
  },
};

export const Button = {
  baseStyle: {
    borderRadius: 8,
    fontWeight: 400,
  },
  variants: { subtle: variantSubtle, primary: variantPrimary },
  sizes: {
    sm: {
      py: '.375rem',
      px: '.625rem',
    },
  },
  md: {
    py: '.5rem',
    px: '.625rem',
    height: 'auto',
  },
};

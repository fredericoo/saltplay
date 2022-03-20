import type { SystemStyleFunction, SystemStyleObject } from '@chakra-ui/theme-tools';
import { getColor, mode, transparentize } from '@chakra-ui/theme-tools';

const baseStyle: SystemStyleObject = {
  textTransform: 'uppercase',
  fontSize: 'xs',
  fontWeight: 'bold',

  borderRadius: 'full',
  px: 2,
  py: 0.5,
};

const variantSolid: SystemStyleFunction = props => {
  const { colorScheme: c, theme } = props;
  const dark = transparentize(`${c}.10`, 0.6)(theme);
  return {
    bg: mode(`${c}.9`, dark)(props),
    color: mode(`white`, `whiteAlpha.800`)(props),
  };
};

const variantSubtle: SystemStyleFunction = props => {
  const { colorScheme: c, theme } = props;
  const darkBg = transparentize(`${c}.2`, 0.16)(theme);
  return {
    bg: mode(`${c}.4`, darkBg)(props),
    color: mode(`${c}.12`, `${c}.1`)(props),
  };
};

const variantOutline: SystemStyleFunction = props => {
  const { colorScheme: c, theme } = props;
  const darkColor = transparentize(`${c}.10`, 0.8)(theme);
  const lightColor = getColor(theme, `${c}.10`);
  const color = mode(lightColor, darkColor)(props);

  return {
    color,
    boxShadow: `inset 0 0 0px 1px ${color}`,
  };
};

const variants = {
  solid: variantSolid,
  subtle: variantSubtle,
  outline: variantOutline,
};

const defaultProps = {
  variant: 'subtle',
  colorScheme: 'grey',
};

const Badge = {
  baseStyle,
  variants,
  defaultProps,
};

export default Badge;

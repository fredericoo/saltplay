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
  const { colorScheme: c } = props;
  return {
    bg: mode(`${c}.9`, `${c}.9`)(props),
    color: mode(`grey.1`, `grey.12`)(props),
  };
};

const variantSubtle: SystemStyleFunction = props => {
  const { colorScheme: c } = props;
  return {
    bg: mode(`${c}.4`, `${c}.4`)(props),
    color: mode(`${c}.12`, `${c}.12`)(props),
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

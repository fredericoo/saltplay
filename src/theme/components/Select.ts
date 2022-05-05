import { SystemStyleFunction } from '@chakra-ui/theme-tools';
import { Button } from './Button';

const variantSolid: SystemStyleFunction = props => ({
  field: { ...Button.baseStyle, ...Button.variants.solid(props) },
  icon: { color: 'grey.10' },
});

export const Select = {
  variants: {
    solid: variantSolid,
    transparent: {
      field: { bg: 'transparent', _focus: { bg: 'grey.2' } },
      icon: { color: 'grey.10' },
    },
  },
  sizes: {
    md: {
      field: {
        ...Button.sizes.md,
      },
      icon: {
        w: 'auto',
        right: { base: '1.5rem', md: '.75rem' },
      },
    },
  },
  defaultProps: {
    variant: 'solid',
    colorScheme: 'grey',
  },
};

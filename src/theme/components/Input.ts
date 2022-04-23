import { mode, SystemStyleFunction } from '@chakra-ui/theme-tools';
import { Button } from './Button';

const variantTransparent: SystemStyleFunction = props => ({
  field: {
    bg: 'transparent',
    color: 'grey.11',
    borderRadius: 'lg',
    _focus: { color: 'grey.12' },
    _invalid: { color: mode('danger.11', 'dangerDark.11')(props) },
  },
});

export const Input = {
  variants: {
    default: {
      field: {
        bg: 'grey.1',
        color: 'grey.12',
        border: '1px solid',
        borderRadius: 'lg',
        borderColor: 'grey.6',

        _focus: { borderColor: 'grey.8', boxShadow: 'none' },
        _invalid: { borderColor: 'danger.9' },
      },
    },
    transparent: variantTransparent,
  },
  sizes: Object.fromEntries(
    Object.entries(Button.sizes).map(([size, { px, borderRadius }]) => [size, { field: { px, borderRadius } }])
  ),
  defaultProps: {
    variant: 'default',
  },
};

import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

const variantError: SystemStyleFunction = props => ({
  color: mode('danger.11', 'dangerDark.11')(props),
  bg: mode('danger.4', 'dangerDark.4')(props),
  borderColor: mode('danger.6', 'dangerDark.6')(props),
});

const variantMedal: SystemStyleFunction = props => ({
  borderColor: 'primary.11',
  color: 'grey.12',
  textTransform: 'uppercase',
  letterSpacing: 'widest',
  fontWeight: 'medium',
  fontSize: 'xs',
});

export const Tooltip = {
  baseStyle: {
    borderRadius: 'lg',
    bg: 'grey.4',
    border: '1px solid',
    borderColor: 'grey.6',
    color: 'grey.11',
    boxShadow: 'soft',
  },
  variants: {
    error: variantError,
    medal: variantMedal,
  },
};

export const Input = {
  variants: {
    custom: {
      field: {
        color: 'gray.900',
        border: '1px solid',
        borderColor: 'gray.300',

        _focus: { borderColor: 'gray.400', boxShadow: 'none' },
      },
    },
  },
  defaultProps: {
    variant: 'custom',
  },
};

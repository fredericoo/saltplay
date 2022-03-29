export const Input = {
  variants: {
    custom: {
      field: {
        bg: 'grey.1',
        color: 'grey.12',
        border: '1px solid',
        borderRadius: 'lg',
        borderColor: 'grey.6',

        _focus: { borderColor: 'grey.8', boxShadow: 'none' },
      },
    },
  },
  defaultProps: {
    variant: 'custom',
  },
};

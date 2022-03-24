export const Menu = {
  parts: ['list', 'item'],

  variants: {
    custom: {
      list: {
        fontSize: { base: 'md', md: 'sm' },
        border: 'none',
        boxShadow: 'lg',
        borderRadius: '8',
        p: '3px',
      },
      item: {
        color: 'grey.12',
        transition: 'none',
        borderRadius: '6',
        _hover: {
          bg: 'grey.4',
        },
        _focus: {
          bg: 'grey.3',
        },
      },
    },
  },
  defaultProps: {
    variant: 'custom',
  },
};

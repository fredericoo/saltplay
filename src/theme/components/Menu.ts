export const Menu = {
  parts: ['list', 'item'],

  variants: {
    custom: {
      list: {
        fontSize: { base: 'md', md: 'sm' },
        border: 'none',
        boxShadow: 'md',
        borderRadius: '8',
        p: '3px',
      },
      item: {
        color: 'gray.700',
        transition: 'none',
        borderRadius: '6',
        _hover: {
          bg: 'gray.500',
          color: 'white',
        },
      },
    },
  },
  defaultProps: {
    variant: 'custom',
  },
};

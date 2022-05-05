export const Menu = {
  parts: ['list', 'item'],

  variants: {
    custom: {
      list: {
        bg: 'grey.1',
        fontSize: { base: 'md', md: 'sm' },
        border: '1px solid var(--wrkplay-colors-grey-5)',
        boxShadow: 'lg',
        borderRadius: '8',
        p: '3px',
      },
      item: {
        color: 'grey.12',
        transition: 'none',
        borderRadius: '6',
        _hover: {
          bg: 'grey.5',
        },
        '&[data-active]': {
          bg: 'grey.6',
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

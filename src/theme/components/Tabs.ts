export const Tabs = {
  parts: ['root', 'tab', 'tablist', 'tabpanel'],
  variants: {
    custom: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 4,
      },
      tab: {
        color: 'gray.500',
        borderRadius: 10,
        px: 4,
        py: 1.5,
        _hover: {
          bg: 'gray.100',
        },
        ':not(:last-child)': { mr: 1 },
        _selected: {
          bg: 'white',
          color: 'gray.900',
          boxShadow: 'sm',
        },
        _focus: {
          boxShadow: 'sm',
        },
        fontSize: 'sm',
      },
      tablist: {
        display: 'flex',
        p: 0.5,
        bg: 'gray.200',
        borderRadius: 12,
        boxShadow: 'inset 0px 0px 8px rgba(0, 0, 0, 0.0125), inset 0px 2px 4px rgba(0, 0, 0, 0.025)',
      },
      tabpanel: {
        p: 0,
      },
    },
  },
  defaultProps: {
    variant: 'custom',
  },
};

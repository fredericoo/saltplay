const variantPill = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pt: 4,
  },
  tab: {
    color: 'grey.11',
    borderRadius: 10,
    px: 4,
    py: 1.5,
    _hover: {
      bg: 'grey.1',
    },
    ':not(:last-child)': { mr: 1 },
    _selected: {
      bg: 'grey.1',
      color: 'grey.12',
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
    bg: 'grey.4',
    borderRadius: 12,
    boxShadow: 'inset 0px 0px 8px rgba(0, 0, 0, 0.0125), inset 0px 2px 4px rgba(0, 0, 0, 0.025)',
    overflow: 'hidden',
  },
  tabpanel: {
    p: 0,
  },
};

const variantBottomBar = {
  ...variantPill,
  tablist: {
    display: 'flex',
    overflow: 'auto',
    position: 'fixed',
    bottom: 0,
    zIndex: 'overlay',
    w: '100%',
    boxShadow:
      '0px 24px 80px rgba(0, 0, 0, 0.06), 0px 12.4857px 29.2013px rgba(0, 0, 0, 0.0413989), 0px 5.92003px 14.1767px rgba(0, 0, 0, 0.0333774), 0px 2.46393px 6.94968px rgba(0, 0, 0, 0.0266226), 0px 0.720165px 2.74791px rgba(0, 0, 0, 0.0186011)',
    p: 1,
    pb: 'calc(env(safe-area-inset-bottom, 0.5vh) + 32px)',
    bg: 'grey.1',
    borderTopRadius: 24,
    borderBottomRadius: 0,
  },
  tab: {
    ...variantPill.tab,
    flexDirection: 'column',
    borderRadius: 20,
    flex: 1,
    py: 3,
    fontSize: 'xs',
    _selected: {
      bg: 'primary.3',
      color: 'primary.10',
      boxShadow: 'none',
    },
  },
};

export const Tabs = {
  parts: ['root', 'tab', 'tablist', 'tabpanel'],
  variants: {
    custom: variantPill,
    bottom: variantBottomBar,
  },
  defaultProps: {
    variant: 'custom',
  },
};

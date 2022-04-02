import hideScrollbar from '@/lib/styleUtils';
import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

const variantPill: SystemStyleFunction = props => {
  return {
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
        bg: mode('grey.1', 'grey.6')(props),
      },
      ':not(:last-child)': { mr: 1 },
      _selected: {
        bg: mode('grey.1', 'grey.8')(props),
        color: mode('grey.12', 'grey.12')(props),
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
      bg: mode('grey.4', 'grey.1')(props),
      borderRadius: 12,
      boxShadow: 'inset 0px 0px 8px rgba(0, 0, 0, 0.0125), inset 0px 2px 4px rgba(0, 0, 0, 0.025)',
      maxW: '100%',
      ...hideScrollbar,
    },
    tabpanel: {
      p: 0,
    },
  };
};

const variantBottomBar: SystemStyleFunction = props => ({
  ...variantPill,
  tablist: {
    display: 'flex',
    overflow: 'auto',
    position: 'fixed',
    zIndex: 'overlay',
    boxShadow:
      '0px 24px 80px rgba(0, 0, 0, 0.06), 0px 12.4857px 29.2013px rgba(0, 0, 0, 0.0413989), 0px 5.92003px 14.1767px rgba(0, 0, 0, 0.0333774), 0px 2.46393px 6.94968px rgba(0, 0, 0, 0.0266226), 0px 0.720165px 2.74791px rgba(0, 0, 0, 0.0186011)',
    p: 1,
    left: 4,
    right: 4,
    bottom: 'calc(env(safe-area-inset-bottom) + 8px)',
    bg: mode('grey.1', 'grey.4')(props),
    borderRadius: 'full',
  },
  tab: {
    flexDirection: 'column',
    borderRadius: 20,
    flex: 1,
    py: 2,
    fontSize: 'md',

    color: mode('grey.9', 'grey.11')(props),
    _selected: {
      bg: mode('grey.4', 'grey.8')(props),
      color: mode('grey.12', 'grey.12')(props),
      boxShadow: 'none',
    },
  },
  tabpanel: {
    px: 0,
  },
});

export const variantSidebar = {
  root: {
    css: { '--sidebar-width': '300px' },
    display: 'grid',
    gridTemplateColumns: { md: 'var(--sidebar-width) 1fr' },
    pt: 0,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    color: 'grey.11',
    px: 4,
    py: 1.5,
    _hover: {
      bg: 'grey.3',
    },
    ':not(:last-child)': { mb: 1 },
    _selected: {
      bg: 'grey.3',
      color: 'primary.10',
    },
    fontSize: 'sm',
    justifyContent: 'flex-start',
  },
  tablist: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: { md: '1px solid' },
    borderColor: { md: 'grey.4' },
    pt: 4,
  },
  tabpanel: {
    py: 0,
    px: 4,
  },
};

export const Tabs = {
  parts: ['root', 'tab', 'tablist', 'tabpanel'],
  variants: {
    custom: variantPill,
    sidebar: variantSidebar,
    bottom: variantBottomBar,
  },
  defaultProps: {
    variant: 'custom',
  },
};

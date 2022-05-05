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
      whiteSpace: 'nowrap',
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
    boxShadow: 'soft',
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
    _focus: {
      bg: 'grey.3',
      boxShadow: 'none',
    },
    fontSize: 'sm',
    justifyContent: 'flex-start',
  },
  tablist: {
    display: 'flex',
    alignSelf: 'start',
    flexDirection: 'column',
    position: 'sticky',
    top: 'calc(64px + env(safe-area-inset-top))',
    pt: 4,
  },
  tabpanel: {
    borderLeft: { md: '1px solid' },
    borderColor: { md: 'grey.4' },
    p: 4,
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

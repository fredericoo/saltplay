export const Modal = {
  parts: ['dialog', 'dialogContainer', 'overlay'],
  variants: {
    custom: {
      dialog: {
        bg: 'grey.1',
        borderRadius: '28',
      },
      dialogContainer: {
        px: 2,
      },
      overlay: {
        backdropFilter: 'blur(4px)',
      },
    },
  },
  defaultProps: {
    variant: 'custom',
  },
};

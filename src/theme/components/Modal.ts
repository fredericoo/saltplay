export const Modal = {
  parts: ['dialog', 'dialogContainer'],
  variants: {
    custom: {
      dialog: {
        borderRadius: '28',
      },
      dialogContainer: {
        px: 2,
      },
    },
  },
  defaultProps: {
    variant: 'custom',
  },
};

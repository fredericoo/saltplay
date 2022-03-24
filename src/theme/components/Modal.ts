export const Modal = {
  parts: ['dialog', 'dialogContainer'],
  variants: {
    custom: {
      dialog: {
        bg: 'grey.1',
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

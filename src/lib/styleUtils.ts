const hideScrollbar = {
  '-ms-overflow-style': '-ms-autohiding-scrollbar',
  '-webkit-overflow-scrolling': 'touch',
  overflow: ['auto', '-moz-scrollbars-none'],
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};

export const centraliseEmoji = {
  '@media only screen and (-webkit-min-device-pixel-ratio: 2), not all, not all, not all, only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx)':
    {
      span: {
        lineHeight: '1em',
        display: 'inline-block',
        fontSize: '4em',
        transform: 'scale(.25) translateY(1em)',
        margin: '-0.55em -0.4em 0',
      },
    },
};

export const gradientProps = [
  [
    'linear-gradient(-135deg, #FBB826, #FE33A1)',
    'linear-gradient(-135deg, color(display-p3 1 0.638 0), color(display-p3 1 0 0.574))',
  ],
] as unknown as string[];

export default hideScrollbar;

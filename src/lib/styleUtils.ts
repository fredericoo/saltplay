const hideScrollbar = {
  '-ms-overflow-style': '-ms-autohiding-scrollbar',
  '-webkit-overflow-scrolling': 'touch',
  overflow: '-moz-scrollbars-none',
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

export default hideScrollbar;

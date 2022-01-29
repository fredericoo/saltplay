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
        display: 'inline-block',
        marginRight: '-0.3em',
      },
    },
};

export default hideScrollbar;

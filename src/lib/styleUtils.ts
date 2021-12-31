const hideScrollbar = {
  msOverflowStyle: '-ms-autohiding-scrollbar',
  WebkitOverflowScrolling: 'touch',
  overflow: '-moz-scrollbars-none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};

export default hideScrollbar;

const hideScrollbar = {
  '-ms-overflow-style': '-ms-autohiding-scrollbar',
  '-webkit-overflow-scrolling': 'touch',
  overflow: '-moz-scrollbars-none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};

export default hideScrollbar;

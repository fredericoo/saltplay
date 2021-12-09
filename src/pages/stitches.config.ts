import { createStitches } from '@stitches/react';

export const { styled, css, globalCss, keyframes, getCssText, theme, createTheme, config } = createStitches({
  theme: {
    colors: {
      gray400: 'gainsboro',
      gray500: 'lightgray',
    },
  },
  media: {
    bp1: '(min-width: 480px)',
  },
  utils: {
    mx: (value: string) => ({ marginInlineStart: value, marginInline: value }),
    my: (value: string) => ({ marginBlockStart: value, marginBlockEnd: value }),
  },
});

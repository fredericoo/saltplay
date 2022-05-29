import { Global } from '@emotion/react';

const Fonts: React.VFC = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'GT-Walsheim Pro';
        font-style: normal;
        font-weight: normal;
        font-display: swap;
        src: url('/fonts/GT-Walsheim-Pro-Medium.woff2') format('woff2');
      }
      @font-face {
        font-family: 'GT-Walsheim Pro';
        font-style: normal;
        font-weight: bold;
        font-display: swap;
        src: url('/fonts/GT-Walsheim-Pro-Bold.woff2') format('woff2');
      }
      `}
  />
);

export default Fonts;

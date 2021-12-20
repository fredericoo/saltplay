import { Global } from '@emotion/react';

const Fonts: React.VFC = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'Roobert';
        font-style: normal;
        font-weight: normal;
        font-display: swap;
        src: url('/fonts/Roobert-Regular.woff') format('woff');
      }
      @font-face {
        font-family: 'Roobert';
        font-style: normal;
        font-weight: bold;
        font-display: swap;
        src: url('/fonts/Roobert-Bold.woff') format('woff');
      }
      `}
  />
);

export default Fonts;

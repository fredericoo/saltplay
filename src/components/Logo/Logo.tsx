import { Box, ChakraComponent } from '@chakra-ui/react';

const Logo: ChakraComponent<'div'> = props => {
  return (
    <Box {...props}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M50 8C50 3.58172 53.5817 0 58 0H92C96.4183 0 100 3.58172 100 8V42C100 46.4183 96.4183 50 92 50H75C61.1929 50 50 61.1929 50 75V92C50 96.4183 46.4183 100 42 100H8C3.58172 100 0 96.4183 0 92V58C0 53.5817 3.58172 50 8 50H25C38.8071 50 50 38.8071 50 25V8Z"
          fill="url(#paint0_linear_3049_7542)"
        />
        <defs>
          <style type="text/css" jsx>
            {`
              .stop1 {
                stop-color: #fbb826;
                stop-color: color(display-p3 1 0.638 0);
              }
              .stop2 {
                stop-color: #fe33a1;
                stop-color: color(display-p3 1 0 0.574);
              }
            `}
          </style>
          <linearGradient
            id="paint0_linear_3049_7542"
            x1="100"
            y1="5.99226e-06"
            x2="-18.6314"
            y2="67.0213"
            gradientUnits="userSpaceOnUse"
          >
            <stop className="stop1" />
            <stop offset="1" className="stop2" />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  );
};

export default Logo;

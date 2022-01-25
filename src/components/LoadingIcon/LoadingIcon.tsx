import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const Wrapper = motion(Box);

type LoadingIconProps = {
  size?: number | string;
  color: string;
};

const LoadingIcon: React.VFC<LoadingIconProps> = ({ color, size = 8 }) => {
  return (
    <Wrapper animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }} color={color} h={size} w={size}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.rect
          y="50"
          width="50"
          height="50"
          rx="8"
          fill="currentColor"
          animate={{ y: -25, x: 25 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
        />
        <motion.rect
          x="50"
          width="50"
          height="50"
          rx="8"
          fill="currentColor"
          animate={{ y: 25, x: -25 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
        />
        <motion.path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M50 25C50 38.8071 38.8071 50 25 50L25 75L50 75C50 61.1929 61.1929 50 75 50L75 25L50 25Z"
          fill="currentColor"
          animate={{ scale: 0.5 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
        />
      </svg>
    </Wrapper>
  );
};

export default LoadingIcon;

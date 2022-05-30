import { keyframes } from '@chakra-ui/system';
import type { SystemStyleFunction } from '@chakra-ui/theme-tools';

const fade = (startColor: string, endColor: string) =>
  keyframes({
    from: { borderColor: startColor, background: startColor },
    to: { borderColor: endColor, background: endColor },
  });

const baseStyle: SystemStyleFunction = props => {
  const { startColor, endColor, speed } = props;

  return {
    opacity: 0.7,
    borderRadius: '2px',
    borderColor: startColor,
    background: startColor,
    animation: `${speed}s linear infinite alternate ${fade(startColor, endColor)}`,
  };
};

const Skeleton = {
  baseStyle,
  defaultProps: {
    startColor: 'var(--wrkplay-colors-grey-6)',
    endColor: 'var(--wrkplay-colors-grey-3)',
  },
};

export default Skeleton;

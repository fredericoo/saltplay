import { SystemStyleObject } from '@chakra-ui/theme-tools';

const baseStyle: SystemStyleObject = {
  fontFamily: 'heading',
  fontWeight: 'bold',
};

const sizes: Record<string, SystemStyleObject> = {
  xl: { fontSize: '4xl', lineHeight: 1, letterSpacing: 'tight' },
  lg: { fontSize: '4xl', lineHeight: 1, letterSpacing: 'tighter' },
  md: { fontSize: '2xl', lineHeight: 1, letterSpacing: 'tight' },
};

const defaultProps = {
  size: 'xl',
};

const Heading = {
  baseStyle,
  sizes,
  defaultProps,
};

export default Heading;

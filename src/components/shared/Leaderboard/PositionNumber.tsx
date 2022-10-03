import { Box } from '@chakra-ui/react';

type PositionNumberProps = {
  position: number;
};

const PositionNumber: React.FC<PositionNumberProps> = ({ position }) => {
  const digits = Math.max(position.toString().length, 2);
  return (
    <Box
      textAlign="right"
      w="2.5rem"
      pr={2}
      fontSize={`${1.875 / (0.5 * (digits - 2) + 1)}rem`}
      color="grey.9"
      whiteSpace="nowrap"
      overflow="hidden"
      sx={{ fontVariantNumeric: 'tabular-nums' }}
      letterSpacing="tighter"
      userSelect="none"
    >
      {position}
    </Box>
  );
};

export default PositionNumber;

import { Box } from '@chakra-ui/react';

type PositionNumberProps = {
  position: number;
  displayMedals?: boolean;
};

const medals: Record<number, string> = {
  0: '🙋',
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

const PositionNumber: React.VFC<PositionNumberProps> = ({ position, displayMedals }) => {
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
      {displayMedals && medals[position] ? medals[position] : position}
    </Box>
  );
};

export default PositionNumber;

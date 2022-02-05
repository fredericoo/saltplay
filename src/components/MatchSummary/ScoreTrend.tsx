import { Box, HStack, Text } from '@chakra-ui/react';

type ScoreTrendProps = {
  score: number;
  isPositive: boolean;
};

const ScoreTrend: React.VFC<ScoreTrendProps> = ({ score, isPositive }) => {
  if (!score) return null;
  return (
    <HStack fontSize="xs" spacing={1}>
      <Box
        border=".5em solid"
        borderColor="transparent"
        borderTopColor={isPositive ? undefined : 'red.300'}
        borderBottomColor={isPositive ? 'cyan.400' : undefined}
        transform={`translateY(${isPositive ? '-12.5%' : '25%'})`}
        h={0}
        w={0}
      />
      <Text color="gray.600">{score}</Text>
    </HStack>
  );
};

export default ScoreTrend;

import { HStack, Text } from '@chakra-ui/react';
import PointIcon from '../../PointIcon';

type ScoreTrendProps = {
  score: number;
  isPositive: boolean;
};

const ScoreTrend: React.VFC<ScoreTrendProps> = ({ score, isPositive }) => {
  if (!score) return null;
  const color = isPositive ? 'success.9' : 'danger.9';
  return (
    <HStack
      fontSize="xs"
      fontWeight="bold"
      spacing={1}
      color={{ base: color, md: 'grey.8' }}
      _groupHover={{ color }}
      transition=".3s ease-out"
    >
      <Text>
        {isPositive ? '+' : '–'}
        {score}
      </Text>
      <PointIcon bg="currentColor" />
    </HStack>
  );
};

export default ScoreTrend;

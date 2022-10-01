import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import Skeleton from '../Skeleton';

type StatProps = {
  label: string;
  content?: string | number;
  isLoading?: boolean;
};

const Stat: React.FC<StatProps> = ({ label, isLoading, content }) => {
  const bg = useColorModeValue('grey.3', 'grey.2');

  return (
    <Box bg={bg} borderRadius="xl" p={4} flex={1}>
      <Text fontSize="md" color="grey.9" mb={2}>
        {label}
      </Text>
      <Text as="div" fontSize="2xl" fontWeight="normal" lineHeight={1}>
        {isLoading ? <Skeleton w="80%" h="1em" /> : content}
      </Text>
    </Box>
  );
};

export default Stat;

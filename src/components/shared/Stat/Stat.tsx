import { Box, Skeleton, Text, useColorModeValue } from '@chakra-ui/react';

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
        <Skeleton isLoaded={!isLoading}>{!isLoading ? content : '…'}</Skeleton>
      </Text>
    </Box>
  );
};

export default Stat;

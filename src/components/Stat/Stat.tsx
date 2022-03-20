import { Box, Skeleton, Text } from '@chakra-ui/react';

type StatProps = {
  label: string;
  content?: string | number;
  isLoading?: boolean;
};

const Stat: React.VFC<StatProps> = ({ label, isLoading, content }) => {
  return (
    <Box bg="grey.3" borderRadius="xl" p={4} flex={1}>
      <Text fontSize="md" color="grey.9" mb={2}>
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight="normal" lineHeight={1}>
        <Skeleton isLoaded={!isLoading}>{!isLoading ? content : '…'}</Skeleton>
      </Text>
    </Box>
  );
};

export default Stat;

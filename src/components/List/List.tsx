import { ChakraProps, Stack } from '@chakra-ui/react';

const List: React.FC<ChakraProps> = ({ children, ...chakraProps }) => {
  return (
    <Stack spacing={2} bg="grey.4" p={2} borderRadius="22" {...chakraProps}>
      {children}
    </Stack>
  );
};

export default List;

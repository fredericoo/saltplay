import { SimpleGrid, SimpleGridProps } from '@chakra-ui/react';

const List: React.FC<SimpleGridProps> = ({ children, ...chakraProps }) => {
  return (
    <SimpleGrid gap={2} bg="grey.4" p={2} borderRadius="22" {...chakraProps}>
      {children}
    </SimpleGrid>
  );
};

export default List;

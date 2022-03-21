import { SimpleGrid, SimpleGridProps } from '@chakra-ui/react';
import ListItem from './ListItem';

type ListComponent = React.FC<SimpleGridProps> & { Item: typeof ListItem };

const List: ListComponent = ({ children, ...chakraProps }) => {
  return (
    <SimpleGrid gap={2} bg="grey.4" p={2} borderRadius="22" {...chakraProps}>
      {children}
    </SimpleGrid>
  );
};

List.Item = ListItem;

export default List;

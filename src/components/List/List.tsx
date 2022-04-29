import { SimpleGrid, SimpleGridProps, useColorMode } from '@chakra-ui/react';
import ListItem from './ListItem';

type ListComponent = React.FC<SimpleGridProps> & { Item: typeof ListItem };

const List: ListComponent = ({ children, ...chakraProps }) => {
  const { colorMode } = useColorMode();
  const isDarkmode = colorMode === 'dark';

  return (
    <SimpleGrid gap={2} bg={isDarkmode ? 'grey.1' : 'grey.4'} p={2} borderRadius="22" {...chakraProps}>
      {children}
    </SimpleGrid>
  );
};

List.Item = ListItem;

export default List;

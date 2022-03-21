import { Badge, Box, ChakraProps, HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { ReactElement } from 'react';

type ListItemProps = {
  href: string;
  badge?: string;
  icon?: ReactElement | string | number;
};

const ListItem: React.FC<ListItemProps & ChakraProps> = ({ href, badge, icon, children, ...chakraProps }) => {
  return (
    <Link href={href} passHref>
      <HStack
        p={4}
        as="a"
        bg="grey.1"
        borderRadius="xl"
        _hover={{ bg: 'grey.2' }}
        _active={{ bg: 'grey.5' }}
        {...chakraProps}
      >
        <Box w="1.5em" h="1.5em" bg="grey.1" borderRadius="lg" lineHeight={'1.5em'} textAlign="center">
          {icon}
        </Box>
        <Text flexGrow={1}>{children}</Text>
        {badge && (
          <Badge letterSpacing="wide" color="grey.11" bg="grey.1">
            {badge}
          </Badge>
        )}
      </HStack>
    </Link>
  );
};

export default ListItem;

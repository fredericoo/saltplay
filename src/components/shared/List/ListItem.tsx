import type { FCC } from '@/types';
import type { ChakraProps } from '@chakra-ui/react';
import { Badge, Box, HStack, Text, useColorMode } from '@chakra-ui/react';
import Link from 'next/link';
import type { ReactElement } from 'react';

type ListItemProps = {
  href: string;
  badge?: string;
  icon?: ReactElement | string | number;
};

const ListItem: FCC<ListItemProps & ChakraProps> = ({ href, badge, icon, children, ...chakraProps }) => {
  const { colorMode } = useColorMode();
  const isDarkmode = colorMode === 'dark';

  return (
    <li>
      <Link href={href} passHref>
        <HStack
          p={4}
          as="a"
          bg={isDarkmode ? 'grey.3' : 'grey.1'}
          borderRadius="xl"
          _hover={{ bg: isDarkmode ? 'grey.4' : 'grey.2' }}
          _active={{ bg: isDarkmode ? 'grey.5' : 'grey.3' }}
          {...chakraProps}
        >
          <Box w="1.5em" h="1.5em" bg="grey.1" borderRadius="lg" lineHeight={'1.5em'} textAlign="center">
            {icon}
          </Box>
          <Text flexGrow={1} noOfLines={1}>
            {children}
          </Text>
          {badge && (
            <Badge letterSpacing="wide" color="grey.11" bg="grey.1">
              {badge}
            </Badge>
          )}
        </HStack>
      </Link>
    </li>
  );
};

export default ListItem;

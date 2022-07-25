import { Badge, Box, ChakraProps, HStack, Text, useColorMode } from '@chakra-ui/react';
import Link from 'next/link';
import { ReactElement } from 'react';
import IconBlur from '../IconBlur';

type ListItemProps = {
  href: string;
  badge?: string;
  icon?: ReactElement | string | number;
};

const ListItem: React.FC<ListItemProps & ChakraProps> = ({ href, badge, icon, children, ...chakraProps }) => {
  const { colorMode } = useColorMode();
  const isDarkmode = colorMode === 'dark';

  return (
    <li>
      <Link href={href} passHref>
        <HStack
          role="group"
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
          {typeof icon === 'string' && (
            <IconBlur
              icon={icon}
              width={{ base: '300%', md: '100%' }}
              height={{ base: '100%', md: '300%' }}
              top="-100%"
              transition={'1.5s cubic-bezier(0.16, 1, 0.3, 1)'}
              transform={{ base: 'translate(-33.33%, -100%)', md: 'translateX(-100%)' }}
              _groupActive={{ base: 'translate(-33.33%, 66.6%)', md: 'translateX(-50%)' }}
              zIndex={1}
              opacity={0.2}
            />
          )}
        </HStack>
      </Link>
    </li>
  );
};

export default ListItem;

import { Box, Button, HStack, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SidebarItem, Sidebar as SidebarProps } from './types';

const Sidebar: React.VFC<SidebarProps> = ({ items }) => {
  const router = useRouter();

  return (
    <Stack alignSelf="stretch" as="nav" w="400px" bg="gray.50" borderRadius={16} p={8} zIndex="docked">
      {items?.map(item => (
        <SidebarItem key={item.title} {...item} isActive={item.href === router.asPath} />
      ))}
    </Stack>
  );
};

type SidebarItemProps = SidebarItem & {
  isActive: boolean;
};

const SidebarItem: React.VFC<SidebarItemProps> = ({ title, href, icon, isActive }) => {
  return (
    <Link href={href} passHref>
      <HStack
        as="a"
        p={4}
        bg={isActive ? 'gray.100' : undefined}
        _hover={{ bg: 'gray.100' }}
        borderRadius={12}
        _active={{ bg: 'gray.200' }}
        gap={2}
        transition={'.15s ease-in-out'}
        position="relative"
        overflow="hidden"
      >
        <Box
          userSelect={'none'}
          transition={'.6s ease-in-out'}
          fontSize="10em"
          position="absolute"
          filter="blur(.75em) saturate(200%)"
          left={isActive ? '-50%' : '-125%'}
        >
          {icon}
        </Box>

        <Box w="1em">{icon}</Box>
        <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
          {title}
        </Text>
      </HStack>
    </Link>
  );
};

export default Sidebar;

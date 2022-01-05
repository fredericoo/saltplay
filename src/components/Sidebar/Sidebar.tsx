import hideScrollbar from '@/lib/styleUtils';
import { Box, Button, HStack, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import IconBlur from '../IconBlur/IconBlur';
import { SidebarItem, Sidebar as SidebarProps } from './types';

const Sidebar: React.VFC<SidebarProps> = ({ items }) => {
  const router = useRouter();

  return (
    <Stack
      as="nav"
      bg="gray.50"
      direction={{ base: 'row', md: 'column' }}
      borderRadius={16}
      p={{ base: '3px', md: 8 }}
      zIndex="docked"
      overflow="scroll"
      css={hideScrollbar}
      position={{ base: 'sticky', md: 'static' }}
      top={2}
      boxShadow={{ base: 'lg', md: 'none' }}
    >
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
        spacing="0"
        transition={'.15s ease-in-out'}
        position="relative"
        flexShrink={0}
        flexGrow={{ base: 1, md: 0 }}
        overflow="hidden"
        transform="translateZ(0)"
      >
        <IconBlur
          icon={icon}
          height="300%"
          top="-100%"
          transition={isActive ? '1.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'}
          transform={isActive ? 'translateX(-50%)' : 'translateX(-100%)'}
          zIndex={1}
          opacity={0.2}
        />
        <Box zIndex={2} pr={2}>
          {icon}
        </Box>
        <Text zIndex={2} textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
          {title}
        </Text>
      </HStack>
    </Link>
  );
};

export default Sidebar;

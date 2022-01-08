import hideScrollbar from '@/lib/styleUtils';
import { Box, Stack, Text } from '@chakra-ui/react';
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
      w={{ base: 'calc(100% - 16px)', md: undefined }}
      position={{ base: 'fixed', md: 'static' }}
      bottom={'calc(env(safe-area-inset-bottom, 0.5vh) + 32px)'}
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
      <Stack
        align="center"
        direction={{ base: 'column', md: 'row' }}
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
        flexBasis={{ base: 0, md: 'auto' }}
        flexGrow={{ base: 1, md: 0 }}
        fontSize={{ base: 'xs', md: 'md' }}
        overflow="hidden"
        transform="translateZ(0)"
      >
        <IconBlur
          icon={icon}
          height="300%"
          top="-100%"
          transition={isActive ? '1.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'}
          transform={
            isActive
              ? { base: 'translateY(-15%)', md: 'translateX(-50%)' }
              : { base: 'translateY(-100%)', md: 'translateX(-100%)' }
          }
          zIndex={1}
          opacity={0.2}
        />
        <Box zIndex={2} pr={2} h="1.8em">
          {icon}
        </Box>
        <Text zIndex={2} textOverflow={{ md: 'ellipsis' }} overflow={{ md: 'hidden' }} whiteSpace="nowrap">
          {title}
        </Text>
      </Stack>
    </Link>
  );
};

export default Sidebar;

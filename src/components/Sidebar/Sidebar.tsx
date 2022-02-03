import hideScrollbar, { centraliseEmoji } from '@/lib/styleUtils';
import { Box, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import IconBlur from '../IconBlur/IconBlur';
import { Sidebar as SidebarProps, SidebarItem } from './types';

const Sidebar: React.VFC<SidebarProps> = ({ items }) => {
  const router = useRouter();

  return (
    <Stack
      as="nav"
      bg={{ base: 'rgb(247, 250, 252, 0.9)', md: 'gray.50' }}
      backdropFilter={{ base: 'blur(5px) saturate(500%)', md: undefined }}
      direction={{ base: 'row', md: 'column' }}
      borderRadius={16}
      p={{ base: '3px', md: 8 }}
      zIndex="docked"
      overflow="scroll"
      css={hideScrollbar}
      w={{ base: 'calc(100% - 16px)', md: undefined }}
      position={{ base: 'fixed', md: 'static' }}
      bottom={'calc(env(safe-area-inset-bottom, 0.5vh) + 32px)'}
      boxShadow={{ base: 'sm', md: 'none' }}
      spacing={'3px'}
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
        spacing={{ base: 0, md: 3 }}
        transition={'.15s ease-in-out'}
        position="relative"
        flexShrink={0}
        flexBasis={{ base: 0, md: 'auto' }}
        flexGrow={{ base: 1, md: 0 }}
        fontSize={{ base: 'xs', md: 'md' }}
        overflow="hidden"
        transform="translateZ(0)"
        minW={'76px'}
      >
        <Box
          zIndex={2}
          sx={centraliseEmoji}
          fontSize="md"
          pr={2}
          h="1.8em"
          w="1em"
          whiteSpace="nowrap"
          textAlign="center"
        >
          <span>{icon}</span>
        </Box>
        <Text zIndex={2} textOverflow={{ md: 'ellipsis' }} overflow={{ md: 'hidden' }} whiteSpace="nowrap">
          {title}
        </Text>
        <IconBlur
          icon={icon}
          width={{ base: '300%', md: '100%' }}
          height={{ base: '100%', md: '300%' }}
          top="-100%"
          transition={isActive ? '1.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'}
          transform={
            isActive
              ? { base: 'translate(-33.33%, 66.6%)', md: 'translateX(-50%)' }
              : { base: 'translate(-33.33%, -100%)', md: 'translateX(-100%)' }
          }
          zIndex={1}
          opacity={0.2}
        />
      </Stack>
    </Link>
  );
};

export default Sidebar;

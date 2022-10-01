import Logo from '@/components/shared/Logo';
import { currentHistoryStateAtom } from '@/lib/navigationHistory/state';
import useMediaQuery from '@/lib/useMediaQuery';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ColorModeToggler from './ColorModeToggler';
import NavigationBackButton from './NavigationBackButton';
import UserMenu from './UserMenu/UserMenu';

const FeedbackButton = dynamic(() => import('./Feedback'), {
  ssr: false,
});

export const NAVBAR_HEIGHT = 'calc(64px + env(safe-area-inset-top))';

const Navbar: React.FC = () => {
  const isDesktop = useMediaQuery('md');
  const [hasScrolled, setHasScrolled] = useState(false);
  const [currentNavigaton] = useAtom(currentHistoryStateAtom);
  const { pathname } = useRouter();

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HStack
      as="nav"
      css={{ label: 'wrapper' }}
      id="navbar"
      px={{ base: 2, md: 6 }}
      w="100%"
      zIndex="overlay"
      position="fixed"
      h={NAVBAR_HEIGHT}
      top={0}
      spacing={4}
      bg={hasScrolled ? 'grey.2' : undefined}
      boxShadow={hasScrolled ? '0 1px 0 0 var(--wrkplay-colors-grey-6)' : undefined}
      pt="env(safe-area-inset-top)"
      transition="box-shadow .15s ease-out"
    >
      <HStack flex={1} noOfLines={1} alignSelf="stretch" alignItems="flex-start" py={2}>
        <NavigationBackButton />
      </HStack>

      <Box overflow="hidden" h="100%">
        <VStack
          alignSelf="flex-start"
          flexGrow={0.01}
          h={'200%'}
          spacing={0}
          transition="transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
          transform={pathname !== '/' && currentNavigaton?.title && hasScrolled ? 'translateY(-50%)' : 'none'}
        >
          <Link href="/" passHref>
            <HStack h="50%" as="a" align="center" spacing="0" p={2}>
              <Logo h="2rem" w="2rem" mr={3} />
              <Box
                overflow="hidden"
                whiteSpace="nowrap"
                fontSize="lg"
                fontWeight="bold"
                letterSpacing="tight"
                color="grey.12"
              >
                saltplay
              </Box>
            </HStack>
          </Link>
          <HStack h="50%" flex={1} fontWeight="bold">
            <Text noOfLines={1}>{currentNavigaton?.title}</Text>
          </HStack>
        </VStack>
      </Box>

      <HStack justify="flex-end" flex={1}>
        <ColorModeToggler />
        {isDesktop && <FeedbackButton />}
        <UserMenu showUserName={isDesktop} />
      </HStack>
    </HStack>
  );
};

export default Navbar;

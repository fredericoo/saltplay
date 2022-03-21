import { currentHistoryState } from '@/lib/navigationHistory/state';
import useMediaQuery from '@/lib/useMediaQuery';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IoBulb } from 'react-icons/io5';
import { useRecoilValue } from 'recoil';
import FeedbackForm from '../FeedbackForm';
import Logo from '../Logo/Logo';
import ModalButton from '../ModalButton';
import NavigationBackButton from '../NavigationBackButton';
import UserMenu from '../UserMenu/UserMenu';

export const NAVBAR_HEIGHT = '64px';

const Navbar: React.VFC = () => {
  const isDesktop = useMediaQuery('md');
  const [hasScrolled, setHasScrolled] = useState(false);
  const currentNavigaton = useRecoilValue(currentHistoryState);
  const { pathname } = useRouter();

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HStack
      id="navbar"
      px={{ base: 2, md: 6 }}
      w="100%"
      zIndex="docked"
      position="fixed"
      h={NAVBAR_HEIGHT}
      top={0}
      spacing={4}
      bg={hasScrolled ? 'grey.1' : undefined}
      boxShadow={hasScrolled ? '0 1px 0 0 rgba(0, 0, 0, 0.05)' : undefined}
    >
      <HStack flex={1} isTruncated alignSelf="stretch" py={2}>
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
            <Text isTruncated>{currentNavigaton?.title}</Text>
          </HStack>
        </VStack>
      </Box>

      <HStack justify="flex-end" flex={1}>
        <ModalButton
          variant="subtle"
          border="1px solid"
          bg={{ md: 'grey.2' }}
          borderColor={{ base: 'transparent', md: 'grey.8' }}
          _hover={{ borderColor: 'grey.9' }}
          cursor="text"
          size="sm"
          borderRadius="md"
          modalTitle="How are you enjoying SaltPlay?"
          Form={FeedbackForm}
        >
          <Box fontSize={{ base: 'xl', md: 'md' }} color="grey.10">
            <IoBulb />
          </Box>
          {isDesktop ? (
            <Text ml={2} color="grey.9">
              Feedback
            </Text>
          ) : (
            ''
          )}
        </ModalButton>
        <UserMenu showUserName={isDesktop} />
      </HStack>
    </HStack>
  );
};

export default Navbar;

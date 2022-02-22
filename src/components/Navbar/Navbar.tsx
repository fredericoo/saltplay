import { lastHistoryState } from '@/lib/navigationHistory/state';
import useMediaQuery from '@/lib/useMediaQuery';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoBulb } from 'react-icons/io5';
import { VscChevronLeft } from 'react-icons/vsc';
import { useRecoilState } from 'recoil';
import FeedbackForm from '../FeedbackForm';
import Logo from '../Logo/Logo';
import ModalButton from '../ModalButton';
import UserMenu from '../UserMenu/UserMenu';

const Navbar: React.VFC = () => {
  const [lastHistory] = useRecoilState(lastHistoryState);
  const isDesktop = useMediaQuery('md');
  const [hasScrolled, setHasScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HStack
      py={2}
      px={{ base: 2, md: 6 }}
      w="100%"
      zIndex="docked"
      position="sticky"
      top={0}
      spacing={4}
      transition="background .6s ease-out"
      bg={hasScrolled ? 'rgba(237, 242, 247, 0.85)' : undefined}
      backdropFilter={hasScrolled ? 'saturate(180%) blur(20px)' : undefined}
      boxShadow={hasScrolled ? '0 1px 0 0 rgba(0, 0, 0, 0.05)' : undefined}
    >
      <HStack flex={1} isTruncated alignSelf="stretch">
        {lastHistory?.href && lastHistory.title && (
          <Link href={lastHistory.href} passHref>
            <Button size="sm" as="a" variant="ghost" h="100%" leftIcon={<VscChevronLeft />}>
              <Text as="span" isTruncated>
                {lastHistory?.title}
              </Text>
            </Button>
          </Link>
        )}
      </HStack>

      <HStack flexGrow={0.01} justify={'center'}>
        <Link href="/" passHref>
          <HStack as="a" spacing="0" p={2}>
            <Logo h="2rem" w="2rem" mr={{ base: hasScrolled ? 0 : 3, md: 3 }} />
            <Text
              transition="max-width 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
              overflow="hidden"
              whiteSpace="nowrap"
              maxW={{ base: hasScrolled ? 0 : '10ch', md: 'initial' }}
              fontWeight="bold"
              textTransform="uppercase"
              fontSize="sm"
              letterSpacing="widest"
            >
              SaltPlay
            </Text>
          </HStack>
        </Link>
      </HStack>

      <HStack justify="flex-end" flex={1}>
        <ModalButton
          variant="outline"
          bg={{ md: 'gray.100' }}
          borderColor={{ base: 'transparent', md: 'gray.400' }}
          _hover={{ borderColor: 'gray.500' }}
          cursor="text"
          size="sm"
          borderRadius="md"
          modalTitle="How are you enjoying SaltPlay?"
          Form={FeedbackForm}
        >
          <Box fontSize={{ base: 'xl', md: 'md' }} color="gray.600">
            <IoBulb />
          </Box>
          {isDesktop ? (
            <Text ml={2} color="gray.400">
              Feedback
            </Text>
          ) : (
            ''
          )}
        </ModalButton>
        <UserMenu />
      </HStack>
    </HStack>
  );
};

export default Navbar;

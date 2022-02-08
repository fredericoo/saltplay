import useMediaQuery from '@/lib/useMediaQuery';
import { HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoBulbOutline } from 'react-icons/io5';
import FeedbackForm from '../FeedbackForm';
import Logo from '../Logo/Logo';
import ModalButton from '../ModalButton';
import UserMenu from '../UserMenu/UserMenu';

const Navbar: React.VFC = () => {
  const isDesktop = useMediaQuery('md');
  const [hasScrolled, setHasScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HStack
      py={4}
      px={6}
      w="100%"
      zIndex="docked"
      position="sticky"
      top={0}
      transition="background .6s ease-out"
      bg={hasScrolled ? 'rgba(237, 242, 247, 0.85)' : undefined}
      backdropFilter={hasScrolled ? 'saturate(180%) blur(20px)' : undefined}
      boxShadow={hasScrolled ? '0 1px 0 0 rgba(0, 0, 0, 0.1)' : undefined}
    >
      <Link href="/" passHref>
        <HStack as="a">
          <Logo h="2rem" w="2rem" />
          <Text fontWeight="bold" fontSize="lg" pl="2" letterSpacing="tight">
            SaltPlay
          </Text>
        </HStack>
      </Link>

      <HStack justify="flex-end" flexGrow="1">
        <ModalButton
          variant="outline"
          borderColor="gray.400"
          _hover={{ borderColor: 'gray.500' }}
          color="gray.500"
          cursor="text"
          size="sm"
          borderRadius="md"
          modalTitle="Send us your feedback"
          Form={FeedbackForm}
        >
          <IoBulbOutline />
          {isDesktop ? 'Feedback' : ''}
        </ModalButton>
        <UserMenu />
      </HStack>
    </HStack>
  );
};

export default Navbar;

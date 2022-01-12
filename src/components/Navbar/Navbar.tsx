import { HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import FeedbackForm from '../FeedbackForm';
import Logo from '../Logo/Logo';
import ModalButton from '../ModalButton';
import DevUserMenu from '../UserMenu/DevUserMenu';
import UserMenu from '../UserMenu/UserMenu';

const Navbar: React.VFC = () => {
  return (
    <HStack py={4} px={6} w="100%" zIndex="docked">
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
          Feedback
        </ModalButton>
        <UserMenu />
      </HStack>
    </HStack>
  );
};

export default Navbar;

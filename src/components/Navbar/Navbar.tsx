import { Container, HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import Logo from '../Logo/Logo';
import UserMenu from '../UserMenu/UserMenu';

const Navbar: React.VFC = () => {
  return (
    <HStack py={4} px={4} w="100%" justify="space-between" zIndex="docked">
      <Link href="/" passHref>
        <HStack as="a">
          <Logo h="2rem" w="2rem" />
          <Text fontWeight="bold" fontSize="lg" pl="2" letterSpacing="tight">
            SaltPlay
          </Text>
        </HStack>
      </Link>
      <UserMenu />
    </HStack>
  );
};

export default Navbar;

import { Box, Container, HStack, Text } from '@chakra-ui/react';
import Logo from '../Logo/Logo';
import UserMenu from '../UserMenu/UserMenu';

const Navbar: React.VFC = () => {
  return (
    <Box position="sticky" bg="white" py={4} boxShadow="sm" zIndex="popover">
      <Container maxW="container.lg">
        <HStack justify="space-between">
          <HStack>
            <Logo h="2rem" w="2rem" />
            <Text fontWeight="bold" fontSize="lg" pl="2" letterSpacing="tight">
              SaltPlay
            </Text>
          </HStack>
          <UserMenu />
        </HStack>
      </Container>
    </Box>
  );
};

export default Navbar;

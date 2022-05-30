import { Container } from '@chakra-ui/react';
import PoweredBy from './PoweredBy';

const Footer: React.VFC = () => {
  return (
    <Container maxW="container.lg" py={8} fontSize="xs" color="grey.10" textAlign="center">
      <PoweredBy w="80px" mx="auto" mb={4} />
      SaltPlay is not liable for any collateral happened as a consequence of time spent using the app or in activities
      related to it. You are the sole responsible for managing your own routine.
      <br />
      We believe having a healthy balance between work and leisure can improve productivity and team bonding.
    </Container>
  );
};

export default Footer;

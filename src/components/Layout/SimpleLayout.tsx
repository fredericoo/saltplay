import { Box } from '@chakra-ui/react';
import Footer from '../Footer';
import Navbar from '../Navbar';
import { LayoutComponent } from './types';

const SimpleLayout: LayoutComponent = ({ children, pageHeader }) => {
  return (
    <Box as="main" pb={{ base: '96px', md: '0' }}>
      <Navbar />
      {children}
      <Footer />
    </Box>
  );
};

export default SimpleLayout;

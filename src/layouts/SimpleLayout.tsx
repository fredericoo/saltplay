import { Box } from '@chakra-ui/react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { LayoutComponent } from './types';

const SimpleLayout: LayoutComponent = ({ children }) => {
  return (
    <Box pb={{ base: '96px', md: '0' }}>
      <Navbar />
      {children}
      <Footer />
    </Box>
  );
};

export default SimpleLayout;

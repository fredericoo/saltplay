import { Box, Container, Grid } from '@chakra-ui/react';
import type { SidebarItem } from '@/components/Sidebar/types';
import Sidebar from '@/components/Sidebar';

type LayoutProps = {
  sidebar?: { items: SidebarItem[] };
};

const Layout: React.FC<LayoutProps> = ({ children, sidebar }) => {
  return (
    <Grid py={2} px={2} zIndex={1} w="100%" gridTemplateColumns="400px 1fr" h="100%">
      <Sidebar items={sidebar?.items} />
      <Container maxW="container.lg" as="main">
        {children}
      </Container>
    </Grid>
  );
};

export default Layout;

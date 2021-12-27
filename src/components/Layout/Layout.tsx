import { Box, Container, Grid } from '@chakra-ui/react';
import type { SidebarItem } from '@/components/Sidebar/types';
import Sidebar from '@/components/Sidebar';

type LayoutProps = {
  sidebar?: { items: SidebarItem[] };
};

const Layout: React.FC<LayoutProps> = ({ children, sidebar }) => {
  return (
    <Grid py={2} px={2} zIndex={1} w="100%" gridTemplateColumns={sidebar ? { md: '400px 1fr' } : undefined} h="100%">
      {sidebar && <Sidebar items={sidebar?.items} />}
      <Container maxW="container.lg" as="main" pb={8}>
        {children}
      </Container>
    </Grid>
  );
};

export default Layout;

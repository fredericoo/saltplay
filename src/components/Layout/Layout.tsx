import { Box, Container, ContainerProps, Grid } from '@chakra-ui/react';
import type { SidebarItem } from '@/components/Sidebar/types';
import Sidebar from '@/components/Sidebar';

type LayoutProps = {
  sidebar?: { items: SidebarItem[] };
  containerWidth?: ContainerProps['maxW'];
};

const Layout: React.FC<LayoutProps> = ({ children, sidebar, containerWidth }) => {
  return (
    <Grid
      py={2}
      px={2}
      zIndex={1}
      w="100%"
      gridTemplateColumns={sidebar ? { md: 'minmax(300px, 1fr) 3fr' } : undefined}
      gap={4}
      h={{ md: '100%' }}
    >
      {sidebar && <Sidebar items={sidebar?.items} />}
      <Container maxW={sidebar ? 'container.lg' : containerWidth || 'container.xl'} as="main" pb={8}>
        {children}
      </Container>
    </Grid>
  );
};

export default Layout;

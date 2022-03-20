import Sidebar from '@/components/Sidebar';
import type { SidebarItem } from '@/components/Sidebar/types';
import { Container, ContainerProps, Grid } from '@chakra-ui/react';

type LayoutProps = {
  sidebar?: { items: SidebarItem[] };
  containerWidth?: ContainerProps['maxW'];
};

const Layout: React.FC<LayoutProps> = ({ children, sidebar, containerWidth }) => {
  return (
    <Grid
      px={2}
      zIndex={1}
      w="100%"
      gridTemplateColumns={sidebar ? { md: 'minmax(300px, 1fr) 3fr' } : undefined}
      gap={4}
      h={{ md: '100%' }}
      flexGrow={1}
      flexShrink={1}
    >
      {sidebar && <Sidebar items={sidebar?.items} />}
      <Container pt="76px" maxW={sidebar ? 'container.lg' : containerWidth || 'container.xl'} as="main" pb={8}>
        {children}
      </Container>
    </Grid>
  );
};

export default Layout;

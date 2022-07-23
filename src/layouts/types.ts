import type { NextPage } from 'next/types';
import type { Sidebar } from '../components/Sidebar/types';

export type LayoutProps = {
  sidebar?: Sidebar;
};

export type LayoutComponent = React.FC<LayoutProps>;

export type PageWithLayout<P extends object = Record<string, never>> = NextPage<P> & { Layout: LayoutComponent };

import { NextPage } from 'next/types';
import { PageHeader } from '../PageHeader/types';
import { Sidebar } from '../Sidebar/types';

export type LayoutProps = {
  sidebar?: Sidebar;
  pageHeader?: PageHeader;
};

export type LayoutComponent = React.FC<LayoutProps>;

export type PageWithLayout<P = {}> = NextPage<P> & { Layout: LayoutComponent };

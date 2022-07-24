import type { NextPage } from 'next/types';

export type LayoutProps = {};

export type LayoutComponent = React.FC<LayoutProps>;

export type PageWithLayout<P extends object = Record<string, never>> = NextPage<P> & { Layout: LayoutComponent };

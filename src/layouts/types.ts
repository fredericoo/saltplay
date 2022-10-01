import type { FCC } from '@/types';
import type { NextPage } from 'next/types';

export type LayoutProps = {};

export type LayoutComponent = FCC<LayoutProps>;

export type PageWithLayout<P extends object = Record<string, never>> = NextPage<P> & { Layout: LayoutComponent };

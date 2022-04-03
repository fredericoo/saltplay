import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { canViewDashboard } from './roles';

type TypedField =
  | { type: 'text'; validate?: (input: string) => boolean; format?: (input: string) => string }
  | { type: 'select'; options: string[] }
  | { type: 'number'; min?: number; max?: number }
  | { type: 'flags'; flags: Record<string, number> };

export type EditableField<T extends Record<string, unknown>> = {
  id: keyof T;
  label: string;
  helper?: string;
  preText?: string;
} & TypedField;

export const withDashboardAuth = (getServerSideProps: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx, nextAuthOptions);
  if (!canViewDashboard(session?.user.roleId)) {
    return {
      redirect: {
        destination: '/',
        statusCode: 302,
      },
    };
  }
  return await getServerSideProps(ctx);
};

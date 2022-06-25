import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { canViewDashboard } from './roles';

type SelectOption = { value: string | number; label: string };

export type FieldTypeSpecific =
  | { type: 'text'; format?: (input: string) => string }
  | { type: 'emoji' }
  | { type: 'datetime' }
  | { type: 'select'; options: SelectOption[] | Record<string, SelectOption[]>; allowEmpty?: boolean }
  | { type: 'number'; min?: number; max?: number }
  | { type: 'switch' };

export type EditableField<T> = T extends Record<string, unknown>
  ? {
      // 🚨 Hardcore typescript alert! this is a utility type to prevent nested fields from being used as ids here.
      id: {
        [key in keyof T]: T[key] extends object | undefined | null ? never : key;
      }[keyof T];
      label: string;
      prefix?: string;
      readOnly?: boolean;
    } & FieldTypeSpecific
  : never;

export const withDashboardAuth = (getServerSideProps: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx, nextAuthOptions);
  if (!canViewDashboard(session?.user.roleId)) {
    return {
      redirect: {
        destination: '/',
        statusCode: 403,
      },
    };
  }
  return await getServerSideProps(ctx);
};

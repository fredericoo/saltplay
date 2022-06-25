import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { canViewDashboard } from './roles';

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

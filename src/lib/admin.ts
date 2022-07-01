import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { canViewDashboard } from './roles';

export const withDashboardAuth = (getServerSideProps: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
  const session = await unstable_getServerSession(ctx.req, ctx.res, nextAuthOptions);
  if (!canViewDashboard(session?.user.roleId)) {
    return {
      redirect: {
        destination: '/',
        statusCode: 301,
      },
    };
  }
  return await getServerSideProps(ctx);
};

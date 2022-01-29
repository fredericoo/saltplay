import PrismaAdapter from '@/lib/adapter';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GitHubProvider from 'next-auth/providers/github';
import SlackProvider from 'next-auth/providers/slack';

const providers = [];

if (process.env.SLACK_CLIENT_ID && process.env.SLACK_CLIENT_SECRET) {
  providers.push(
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      idToken: true,
    })
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

if (process.env.NODE_ENV === 'development') {
  providers.push(
    EmailProvider({
      server: {
        host: 'localhost',
        port: '1025',
        auth: {
          user: 'username',
          pass: 'password',
        },
      },
      from: 'saltplay@saltpay.co',
    })
  );
}

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session({ session, user }) {
      return { ...session, user: { ...session.user, id: user.id, roleId: user.roleId as User['roleId'] } };
    },
  },
};

export default NextAuth(nextAuthOptions);

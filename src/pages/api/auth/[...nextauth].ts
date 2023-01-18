import { BANNED_ROLE_ID, GUEST_ROLE_ID, SESSION_MAX_AGE } from '@/constants';
import PrismaAdapter from '@/lib/adapter';
import turnGuestToUser from '@/lib/api/turnGuestToUser';
import prisma from '@/lib/prisma';
import slack from '@/lib/slack/client';
import type { User } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import SlackProvider from 'next-auth/providers/slack';

const providers = [];

if (process.env.NODE_ENV !== 'production') {
  providers.push(
    CredentialsProvider({
      name: 'Admin Sign in',
      credentials: {
        userId: { label: 'User ID', type: 'text', placeholder: 'admin' },
      },
      async authorize(credentials) {
        if (!credentials?.userId) return null;

        const loggedUser = await prisma.user.findUnique({ where: { id: credentials.userId } });
        if (!loggedUser) return null;

        return loggedUser;
      },
    })
  );
}

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

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: SESSION_MAX_AGE,
  },
  callbacks: {
    session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          roleId: (user as User).roleId,
        },
      };
    },
    async signIn({ user, account }) {
      if ((user as User).roleId === BANNED_ROLE_ID) return false;
      if ((user as User).roleId === GUEST_ROLE_ID && account) await turnGuestToUser(user, account);

      if (account?.provider === 'slack') {
        try {
          const userInfo = await slack.users.info({ user: account.providerAccountId });
          if (userInfo.user?.profile) {
            prisma.user.update({
              where: { id: user.id },
              data: { name: userInfo.user.profile.display_name, image: userInfo.user.profile.image_512 },
            });
          }
        } catch {
          console.warn(`⚠️ Failed to update user information for user ${user.id}`);
        }
      }

      return true;
    },
  },
};

export default withSentry(NextAuth(nextAuthOptions));

export const config = {
  api: {
    externalResolver: true,
  },
};

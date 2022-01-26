import PrismaAdapter from '@/lib/adapter';
import prisma from '@/lib/prisma';
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
  secret: 'xcAO/EYHuP0bSGyplq2EaiHjwOLG1Kmp8d0k9ntOF7g=',
  callbacks: {
    session({ session, user }) {
      return { ...session, user: { ...session.user, id: user.id } };
    },
  },
};

export default NextAuth(nextAuthOptions);

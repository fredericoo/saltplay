import NextAuth from 'next-auth';
import SlackProvider from 'next-auth/providers/slack';
import EmailProvider from 'next-auth/providers/email';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '@/lib/prisma';
import PrismaAdapter from '@/lib/adapter';

const providers = [];

providers.push(
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  })
);
if (process.env.NODE_ENV === 'production' && process.env.SLACK_CLIENT_ID && process.env.SLACK_CLIENT_SECRET) {
  providers.push(
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      idToken: true,
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

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  secret: 'xcAO/EYHuP0bSGyplq2EaiHjwOLG1Kmp8d0k9ntOF7g=',
  callbacks: {
    session({ session, user }) {
      return { ...session, user: { ...session.user, id: user.id } };
    },
  },
});

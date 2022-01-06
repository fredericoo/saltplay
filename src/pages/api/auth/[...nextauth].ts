import NextAuth from 'next-auth';
import SlackProvider from 'next-auth/providers/slack';
import EmailProvider from 'next-auth/providers/email';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import PrismaAdapter from '@/lib/adapter';

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

if (process.env.ENABLE_EMAIL_AUTH === 'true') {
  providers.push(
    CredentialsProvider({
      name: 'Developer Mode',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'me@saltplay.app' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email) return null;

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });

        const random = Math.floor(Math.random() * 300) + 100;

        if (user) {
          const { id, email, name, image } = user;
          return { id, email, name, image };
        }

        const newUser = await prisma.user.create({
          data: {
            email: credentials.email,
            name: credentials.email.split('@')[0],
            image: `https://placekitten.com/${random}/${random}`,
          },
        });
        const { id, email, name, image } = newUser;
        return { id, email, name, image };
      },
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

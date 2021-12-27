import { User } from '@prisma/client';
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: User['id'];
      email: User['email'];
      name: User['name'];
      image: User['image'];
    };
  }
}

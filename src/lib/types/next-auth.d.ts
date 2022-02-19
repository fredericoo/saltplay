import { User } from '@prisma/client';
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: Pick<User, 'name' | 'id' | 'email' | 'image' | 'roleId'>;
  }
}

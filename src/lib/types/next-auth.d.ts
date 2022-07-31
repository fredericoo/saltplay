import type { User } from '@prisma/client';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: Pick<User, 'name' | 'id' | 'email' | 'image' | 'roleId' | 'badgeid'>;
  }
}

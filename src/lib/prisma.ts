import { PrismaClient } from '@prisma/client';
type GlobalPrisma = typeof globalThis & {
  prisma: PrismaClient;
};
let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as GlobalPrisma).prisma) {
    (global as GlobalPrisma).prisma = new PrismaClient();
  }
  prisma = (global as GlobalPrisma).prisma;
}
export default prisma;
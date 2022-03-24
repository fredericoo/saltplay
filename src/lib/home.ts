import prisma from '@/lib/prisma';
import { User } from '@prisma/client';

export const getOffices = () =>
  prisma.office.findMany({
    orderBy: { name: 'asc' },
    select: { name: true, icon: true, slug: true, games: { select: { id: true } } },
  });

export const getPlayerSample = () =>
  prisma.$queryRaw`SELECT * FROM "User" ORDER BY RANDOM() LIMIT 20` as Promise<User[]>;

export const getMostRecentGameId = () =>
  prisma.game.findFirst({ orderBy: { matches: { _count: 'desc' } }, select: { id: true } }).then(res => res?.id);

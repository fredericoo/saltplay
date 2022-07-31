import prisma from '@/lib/prisma';
import type { User } from '@prisma/client';

export const getOffices = () =>
  prisma.office.findMany({
    orderBy: { name: 'asc' },
    select: { name: true, icon: true, slug: true, games: { select: { id: true } } },
  });

export const getPlayerSample = () =>
  prisma.$queryRaw`SELECT * FROM "User" ORDER BY RANDOM() LIMIT 20` as Promise<User[]>;

export const getMostRecentGame = () =>
  prisma.game
    .findFirst({
      orderBy: { matches: { _count: 'desc' } },
      select: {
        id: true,
        seasons: {
          where: {
            startDate: {
              lte: new Date(),
            },
          },
          select: { id: true },
          orderBy: { startDate: 'desc' },
          take: 1,
        },
      },
    })
    .then(res => ({ gameId: res?.id || null, seasonId: res?.seasons[0].id || null }));

import prisma from '@/lib/prisma';

export const getOffices = () =>
  prisma.office.findMany({
    orderBy: { name: 'asc' },
    select: { name: true, icon: true, slug: true, games: { select: { id: true } } },
  });

export const getPlayerSample = () =>
  prisma.user.findMany({
    orderBy: { scores: { _count: 'desc' } },
    take: 10,
    select: { id: true, name: true, image: true, roleId: true },
  });

export const getMostRecentGameId = () =>
  prisma.game.findFirst({ orderBy: { matches: { _count: 'desc' } }, select: { id: true } }).then(res => res?.id);

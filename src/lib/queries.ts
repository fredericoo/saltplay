import prisma from './prisma';

export const getOfficeBySlug = async (slug: string) =>
  await prisma.office.findUnique({ where: { slug }, include: { games: true } });

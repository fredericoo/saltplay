import prisma from '@/lib/prisma';
import { Season } from '@prisma/client';

/**
 * Gets a season by id
 * @param id - Season id
 * @returns season with useful properties
 */
const getSeason = async (id: Season['id']) => {
  return await prisma.season.findUnique({
    where: { id },
    select: { id: true, endDate: true, game: { select: { id: true, maxPlayersPerTeam: true } } },
  });
};

export default getSeason;

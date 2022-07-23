import { GAME_FLAGS } from '@/constants';
import type { Game } from '@prisma/client';

export const getFlagTogglesFromNumber = <T extends Record<string, number>>(
  flagKeys: T,
  flagValue: number
): Record<keyof T, boolean> => {
  if (flagKeys.length === 0) return {} as Record<keyof T, boolean>;
  const bitWise = Object.keys(flagKeys).reduce(
    (acc, cur, index) => ({ ...acc, [cur]: 2 ** index }),
    {} as Record<keyof T, number>
  );
  return Object.keys(bitWise).reduce(
    (acc, cur) => ({ ...acc, [cur]: flagValue > 0 && (flagValue & bitWise[cur]) !== 0 }),
    {} as Record<keyof T, boolean>
  );
};

export const getFlagNumberFromToggles = (flagToggles: Record<string, boolean>): number => {
  if (Object.keys(flagToggles).length === 0) return 0;
  return Object.values(flagToggles).reduce((acc, cur, index) => (cur ? acc + 2 ** index : acc), 0);
};

export const getGameFlags = (flags?: Game['flags']) => getFlagTogglesFromNumber(GAME_FLAGS, flags || 0);

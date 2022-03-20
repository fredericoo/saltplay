import { User } from '@prisma/client';

export type SurnameType = 'full' | 'initial';

export const getPlayerName = (name?: User['name'], surnameType?: SurnameType) => {
  if (!name) return 'Anonymous';
  const names = name?.split(' ');
  if (names.length === 1) return name;
  if (surnameType === 'initial') return `${names[0]} ${names[names.length - 1][0].toUpperCase()}`;
  return `${names[0]} ${names[names.length - 1]}`;
};

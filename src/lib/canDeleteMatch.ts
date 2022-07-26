import { MATCH_DELETE_DAYS } from '@/constants';
import type { User } from '@prisma/client';

const differenceInDays = (date1: Date, date2: Date): number => {
  const diff = Math.abs(date2.getTime() - date1.getTime());
  return diff / (1000 * 3600 * 24);
};

type CanDeleteMatchOptions = {
  user?: Pick<User, 'roleId' | 'id'>;
  players: Pick<User, 'id'>[];
  createdAt: Date;
};

const canDeleteMatch = ({ user, players, createdAt }: CanDeleteMatchOptions): boolean => {
  if (!user?.id) return false;
  if (user?.roleId === 0) return true;
  if (differenceInDays(new Date(), new Date(createdAt)) > MATCH_DELETE_DAYS) return false;
  return !!players.find(player => player.id === user.id);
};

export default canDeleteMatch;

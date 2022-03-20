import { User } from '@prisma/client';
import { differenceInDays } from 'date-fns';
import { MATCH_DELETE_DAYS } from './constants';

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

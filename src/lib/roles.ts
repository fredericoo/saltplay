import { BANNED_ROLE_ID, DASHBOARD_ROLES } from '@/constants';
import { TextProps } from '@chakra-ui/react';
import { Role } from '@prisma/client';

const roleStyles: Record<Role['id'], TextProps | undefined> = {
  1: undefined,
  2: { color: 'grey.12' },
};

export const roleIcons: Record<Role['id'], string> = {
  0: '🔑',
  2: '👻',
};

export const getRoleStyles = (roleId?: Role['id']) => {
  if (typeof roleId === 'undefined') return roleStyles[1];
  return roleStyles[roleId];
};

export const canViewDashboard = (roleId?: number) => typeof roleId === 'number' && DASHBOARD_ROLES.includes(roleId);

export const isRemoved = (roleId?: number) => typeof roleId === 'number' && BANNED_ROLE_ID === roleId;

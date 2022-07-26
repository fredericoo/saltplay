import { BANNED_ROLE_ID, DASHBOARD_ROLES } from '@/constants';
import type { TextProps } from '@chakra-ui/react';
import type { Role } from '@prisma/client';

const roleStyles: Record<Role['id'], TextProps | undefined> = {
  1: undefined,
  2: { opacity: 0.5 },
};

export const roleIcons: Record<Role['id'], string> = {
  2: '👻',
};

export const getRoleStyles = (roleId?: Role['id']) => {
  if (typeof roleId === 'undefined') return roleStyles[1];
  return roleStyles[roleId];
};

export const canViewDashboard = (roleId?: number) => typeof roleId === 'number' && DASHBOARD_ROLES.includes(roleId);

export const isRemoved = (roleId?: number) => typeof roleId === 'number' && BANNED_ROLE_ID === roleId;

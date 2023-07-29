import { BANNED_ROLE_ID, DASHBOARD_ROLES } from '@/constants';
import type { Role } from '@prisma/client';

export const roleIcons: Record<Role['id'], string> = {
  2: '👻',
};

export const getRoleStyles = (roleId?: Role['id']) => {
  switch (roleId) {
    case 2:
      return { opacity: 0.5 };
  }
};

export const canViewDashboard = (roleId?: number) => typeof roleId === 'number' && DASHBOARD_ROLES.includes(roleId);

export const isRemoved = (roleId?: number) => typeof roleId === 'number' && BANNED_ROLE_ID === roleId;

import { TextProps } from '@chakra-ui/react';
import { Role } from '@prisma/client';

const roleStyles: Record<Role['id'], TextProps | undefined> = {
  1: undefined,
  2: { color: 'gray.600' },
};

export const getRoleStyles = (roleId?: Role['id']) => {
  if (typeof roleId === 'undefined') return roleStyles[1];
  return roleStyles[roleId];
};

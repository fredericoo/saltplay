import type { SurnameType } from '@/lib/players';
import { getPlayerName } from '@/lib/players';
import { getRoleStyles, isRemoved, roleIcons } from '@/lib/roles';
import type { TextProps } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import type { User } from '@prisma/client';
import Link from 'next/link';

type PlayerNameProps = {
  user: Pick<User, 'id' | 'name' | 'roleId'>;
  surnameType?: SurnameType;
  isLink?: boolean;
};

const PlayerName = ({ user, surnameType, isLink, ...props }: Omit<TextProps, 'as'> & PlayerNameProps) => {
  const isUserRemoved = isRemoved(user.roleId);
  const displayName = isUserRemoved ? 'Anonymous' : getPlayerName(user.name, surnameType);
  const name = [roleIcons[user.roleId], displayName].join(' ');

  const style = getRoleStyles(user.roleId);
  const playerNameProps = { ...style, ...props };

  if (!user.id || !isLink || isUserRemoved)
    return (
      // @ts-ignore
      <Text as="span" {...playerNameProps}>
        {name}
      </Text>
    );

  return (
    <Link href={`/player/${user.id}`} passHref>
      <Text as="a" {...playerNameProps}>
        {name}
      </Text>
    </Link>
  );
};

export default PlayerName;

import { getPlayerName, SurnameType } from '@/lib/players';
import { getRoleStyles, isRemoved, roleIcons } from '@/lib/roles';
import { ComponentWithAs, FlexProps, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import Link from 'next/link';

type PlayerNameProps = {
  user: Pick<User, 'id' | 'name' | 'roleId'>;
  surnameType?: SurnameType;
  isLink?: boolean;
};

const PlayerName: ComponentWithAs<'a', FlexProps & PlayerNameProps> = ({ user, surnameType, isLink, ...props }) => {
  const isUserRemoved = isRemoved(user.roleId);
  const displayName = isUserRemoved ? 'Anonymous' : getPlayerName(user.name, surnameType);
  const name = [roleIcons[user.roleId], displayName].join(' ');

  if (!user.id || !isLink || isUserRemoved)
    return (
      <Text {...getRoleStyles(user.roleId)} as="span" {...props}>
        {name}
      </Text>
    );

  return (
    <Link href={`/player/${user.id}`} passHref>
      <Text {...getRoleStyles(user.roleId)} as="a" {...props}>
        {name}
      </Text>
    </Link>
  );
};

export default PlayerName;

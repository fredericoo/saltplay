import { getPlayerName, SurnameType } from '@/lib/players';
import { getRoleStyles } from '@/lib/roles';
import { ComponentWithAs, FlexProps, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import Link from 'next/link';

type PlayerNameProps = {
  user: Pick<User, 'id' | 'name' | 'roleId'>;
  surnameType?: SurnameType;
  isLink?: boolean;
};

const PlayerName: ComponentWithAs<'a', FlexProps & PlayerNameProps> = ({ user, surnameType, isLink, ...props }) => {
  const displayName = getPlayerName(user.name, surnameType);
  if (!user.id || !isLink)
    return (
      <Text {...getRoleStyles(user.roleId)} as="span" {...props}>
        {displayName}
      </Text>
    );

  return (
    <Link href={`/player/${user.id}`} passHref>
      <Text {...getRoleStyles(user.roleId)} as="a" {...props}>
        {displayName}
      </Text>
    </Link>
  );
};

export default PlayerName;

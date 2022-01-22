import { ComponentWithAs, FlexProps, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import Link from 'next/link';

type PlayerLinkProps = {
  name?: string | null;
  id?: User['id'];
  surnameType?: 'full' | 'initial';
};

const getPlayerName = (name?: PlayerLinkProps['name'], surnameType?: PlayerLinkProps['surnameType']) => {
  if (!name) return 'Anonymous';
  const names = name?.split(' ');
  if (names.length === 1) return name;
  const surname = surnameType === 'initial' ? names[names.length - 1][0].toUpperCase() : names[names.length - 1];
  return [names[0], surname].join(' ');
};

const PlayerLink: ComponentWithAs<'a', FlexProps & PlayerLinkProps> = ({ name, id, surnameType, ...props }) => {
  const displayName = getPlayerName(name, surnameType);

  if (!id)
    return (
      <Text as="span" {...props}>
        {displayName}
      </Text>
    );

  return (
    <Link href={`/player/${id}`} passHref>
      <Text as="a" {...props}>
        {displayName}
      </Text>
    </Link>
  );
};

export default PlayerLink;

import { ComponentWithAs, FlexProps, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import Link from 'next/link';

type PlayerLinkProps = {
  name?: string | null;
  id?: User['id'];
};

const PlayerLink: ComponentWithAs<'a', FlexProps & PlayerLinkProps> = ({ name, id, ...props }) => {
  // first name plus first letter of last name
  const names = name?.split(' ');
  const displayName = names
    ? [names[0], names.length > 1 ? names[names.length - 1][0].toUpperCase() : ''].join(' ')
    : 'Anonymous';

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

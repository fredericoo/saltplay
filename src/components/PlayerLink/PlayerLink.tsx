import { ComponentWithAs, Flex, FlexProps, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import Link from 'next/link';

type PlayerLinkProps = {
  name?: string | null;
  id?: User['id'];
};

const PlayerLink: ComponentWithAs<'a', FlexProps & PlayerLinkProps> = ({ name, id, ...props }) => {
  if (!id)
    return (
      <Text as="span" {...props}>
        {name || 'Anonymous'}
      </Text>
    );

  return (
    <Link href={`/player/${id}`} passHref>
      <Text as="a" {...props}>
        {name || 'Anonymous'}
      </Text>
    </Link>
  );
};

export default PlayerLink;

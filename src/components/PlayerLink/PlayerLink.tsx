import { ComponentWithAs, Flex, FlexProps, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import Link from 'next/link';

type PlayerLinkProps = {
  name: string;
  id?: User['id'];
};

const PlayerLink: ComponentWithAs<'a', FlexProps & PlayerLinkProps> = ({ name, id, ...props }) => {
  if (!id)
    return (
      <Flex align="baseline" {...props}>
        <Text as="span" flexGrow={1} flexShrink={1} overflowWrap="anywhere">
          {name}
        </Text>
      </Flex>
    );

  return (
    <Flex align="baseline" {...props}>
      <Link href={`/player/${id}`} passHref>
        <Text as="a" flexGrow={1} flexShrink={1} overflowWrap="anywhere">
          {name}
        </Text>
      </Link>
    </Flex>
  );
};

export default PlayerLink;

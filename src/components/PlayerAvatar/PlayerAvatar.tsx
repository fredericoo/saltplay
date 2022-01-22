import getUserGradient from '@/theme/palettes';
import { Box, Circle, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

type PlayerAvatarProps = {
  user: { name: User['name']; image?: User['image']; id: User['id'] };
  size?: number | string;
  isLink?: boolean;
};

const PlayerAvatar: React.VFC<PlayerAvatarProps> = ({ user, size = 8, isLink }) => {
  return (
    <LinkWrapper href={isLink ? `/player/${user.id}` : undefined}>
      <Circle
        position="relative"
        boxShadow="0 0 0 3px white"
        size={size}
        bg={getUserGradient(user.id)}
        overflow="hidden"
      >
        {user.image ? (
          <Image
            src={user.image}
            height="300"
            width="300"
            unoptimized
            alt={`${user.name}‘s avatar`}
            objectFit="cover"
          />
        ) : (
          <Text
            w="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ aspectRatio: '1' }}
            color="gray.500"
            fontWeight="bold"
            userSelect={'none'}
            fontSize={`1rem`}
          >
            {user.name ? user.name[0].toUpperCase() : user.id[0].toUpperCase()}
          </Text>
        )}
      </Circle>
    </LinkWrapper>
  );
};

const LinkWrapper: React.FC<{ href?: string }> = ({ href, children }) => {
  if (href)
    return (
      <Link href={href} passHref>
        <Box as="a">{children}</Box>
      </Link>
    );
  return <>{children}</>;
};

export default PlayerAvatar;

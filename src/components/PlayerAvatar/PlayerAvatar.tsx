import { isRemoved } from '@/lib/roles';
import getGradientFromId from '@/theme/palettes';
import { Box, Circle, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

type PlayerAvatarProps = {
  user?: { name?: User['name']; image?: User['image']; id?: User['id']; roleId?: User['roleId'] };
  size?: number | string;
  isLink?: boolean;
};

const PlayerAvatar: React.VFC<PlayerAvatarProps> = ({ user, size = 8, isLink }) => {
  const fontSize = (scale: number) => `max(calc(${typeof size === 'number' ? size * scale + 'rem' : size}), 1rem)`;
  const isUserRemoved = !user || isRemoved(user?.roleId);

  return (
    <LinkWrapper href={isLink && !isUserRemoved ? `/player/${user.id}` : undefined}>
      <Circle
        position="relative"
        boxShadow="0 0 0 3px var(--wrkplay-colors-grey-4)"
        size={size}
        borderRadius="44%"
        bg={getGradientFromId(user?.id)}
        overflow="hidden"
      >
        {isUserRemoved ? (
          <Image
            src={'/avatars/anonymous.png'}
            height="300"
            width="300"
            unoptimized
            alt={`Anonymous avatar`}
            objectFit="cover"
          />
        ) : user.image ? (
          <Image
            src={user.image}
            height="300"
            width="300"
            unoptimized
            alt={`${user.name || 'User'}‘s avatar`}
            objectFit="cover"
          />
        ) : (
          <Text
            w="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ aspectRatio: '1' }}
            color="grey.9"
            fontWeight="bold"
            userSelect={'none'}
            mixBlendMode={'multiply'}
            fontSize={fontSize(1 / 8)}
          >
            {user.name ? user.name[0].toUpperCase() : user.id?.[0].toUpperCase()}
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
        <Box as="a" position="relative">
          {children}
        </Box>
      </Link>
    );
  return <Box position="relative">{children}</Box>;
};

export default PlayerAvatar;

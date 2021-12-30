import getUserGradient from '@/theme/palettes';
import { Circle, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import Image from 'next/image';

type PlayerAvatarProps = {
  user: { name: User['name']; image?: User['image']; id: User['id'] };
  size?: number | string;
};

const PlayerAvatar: React.VFC<PlayerAvatarProps> = ({ user, size = 8 }) => {
  return (
    <Circle boxShadow="0 0 0 3px white" size={size} bg={getUserGradient(user.id)} overflow="hidden">
      {user.image ? (
        <Image src={user.image} height="300" width="300" unoptimized alt={`${user.name}‘s avatar`} objectFit="cover" />
      ) : (
        <Text color="gray.800" lineHeight="1" mt="-0.15em" userSelect={'none'} fontSize={`${+size / 8}em`}>
          {user.name ? user.name[0].toUpperCase() : user.id[0].toUpperCase()}
        </Text>
      )}
    </Circle>
  );
};

export default PlayerAvatar;

import { Circle, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';

type PlayerAvatarProps = {
  name?: string | null;
  photo?: string | null;
  size?: number | string;
};

const PlayerAvatar: React.VFC<PlayerAvatarProps> = ({ name = 'guest', photo, size = 8 }) => {
  return (
    <Circle size={size} bg="gray.200" overflow="hidden">
      {photo ? (
        <Image src={photo} height="300" width="300" unoptimized alt={`${name}‘s avatar`} objectFit="cover" />
      ) : (
        <Text userSelect={'none'}>{name ? name[0].toUpperCase() : '?'}</Text>
      )}
    </Circle>
  );
};

export default PlayerAvatar;

import { MotionBox } from '@/components/shared/Motion';
import PlayerAvatar from '@/components/shared/PlayerAvatar';
import { Box } from '@chakra-ui/react';
import type { User } from '@prisma/client';
import { useMemo } from 'react';

export type PlayersDecoProps = { players: Pick<User, 'id' | 'image' | 'name' | 'roleId'>[] };

const PlayersDeco: React.VFC<PlayersDecoProps> = ({ players }) => {
  return (
    <Box position="absolute" zIndex={0} inset={0} css={{ perspective: '100vw' }}>
      <Box
        transform="rotateX(30deg)"
        css={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
        h="100%"
        w="100%"
        position="relative"
      >
        {players?.map((user, i) => (
          <PlayerDeco user={user} key={user.id} index={i} length={players.length} />
        ))}
      </Box>
    </Box>
  );
};

const PlayerDeco: React.VFC<{ user: PlayersDecoProps['players'][number]; index: number; length: number }> = ({
  user,
  index,
  length,
}) => {
  const height = useMemo(() => -512 + Math.random() * 1024, []);
  const duration = length / 4;
  return (
    <MotionBox
      zIndex={0}
      initial={{ translateY: 0, translateZ: height, opacity: 1 }}
      animate={{ translateY: -2000, opacity: 0 }}
      transition={{
        repeat: Infinity,
        ease: 'linear',
        delay: (index * duration) / length,
        duration,
      }}
      pointerEvents={'none'}
      position="absolute"
      left={`${index ** (index + 1) % 100}%`}
      bottom="-50%"
      opacity={1}
      css={{ transformStyle: 'preserve-3d' }}
      filter={`blur(${Math.abs(height) / 128}px)`}
    >
      <PlayerAvatar size={16} user={user} />
    </MotionBox>
  );
};

export default PlayersDeco;

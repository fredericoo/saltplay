import PlayerAvatar from '@/components/shared/PlayerAvatar';
import { Box, keyframes } from '@chakra-ui/react';
import type { User } from '@prisma/client';
import { useMemo } from 'react';

export type PlayersDecoProps = { players: Pick<User, 'id' | 'image' | 'name' | 'roleId'>[] };

const PlayersDeco: React.FC<PlayersDecoProps> = ({ players }) => {
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

const fly = keyframes`
	0% {
		transform: translateY(0) translateZ(var(--zPosition));
    opacity: 1;
	}
	100% {
    transform: translateY(-2000%) translateZ(var(--zPosition));
    opacity: 0;
	}`;

const PlayerDeco: React.FC<{ user: PlayersDecoProps['players'][number]; index: number; length: number }> = ({
  user,
  index,
  length,
}) => {
  const height = useMemo(() => -512 + Math.random() * 1024, []);
  const duration = length / 4;
  const delay = (index * duration) / length;
  return (
    <Box
      zIndex={0}
      css={{ '--zPosition': `${height}px` }}
      animation={`${fly} ${duration}s linear ${delay}s infinite`}
      pointerEvents={'none'}
      position="absolute"
      left={`${index ** (index + 1) % 100}%`}
      bottom="-50%"
      opacity={1}
      filter={`blur(${Math.abs(height) / 128}px)`}
    >
      <PlayerAvatar size={16} user={user} />
    </Box>
  );
};

export default PlayersDeco;

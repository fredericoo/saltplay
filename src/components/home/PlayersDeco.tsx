import { Box } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { useMemo } from 'react';
import { MotionBox } from '../Motion';
import PlayerAvatar from '../PlayerAvatar';

export type PlayersDecoProps = { players: Pick<User, 'id' | 'image' | 'name' | 'roleId'>[] };

const PlayersDeco: React.VFC<PlayersDecoProps> = ({ players }) => {
  return (
    <Box position="absolute" zIndex={0} inset={0} transform="rotate(-15deg)">
      {players?.map(user => (
        <PlayerDeco user={user} key={user.id} />
      ))}
    </Box>
  );
};

const PlayerDeco: React.VFC<{ user: PlayersDecoProps['players'][number] }> = ({ user }) => {
  const random = useMemo(() => Math.random(), []);

  return (
    <MotionBox
      zIndex={0}
      initial={{ translateY: 1000, opacity: 1 }}
      animate={{ translateY: -1000, opacity: 0 }}
      transition={{ repeat: Infinity, duration: random * -6 + 12 }}
      pointerEvents={'none'}
      position="relative"
      left={random * 100 + '%'}
      bottom={0}
      filter={`blur(${random * 4}px)`}
      transform={`scale(${random * 1 + 0.5})`}
      opacity={1.0 - random * 0.9}
    >
      <PlayerAvatar size={16} user={user} />
    </MotionBox>
  );
};

export default PlayersDeco;

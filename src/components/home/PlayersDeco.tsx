import { Box } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { motion } from 'framer-motion';
import { memo } from 'react';
import PlayerAvatar from '../PlayerAvatar';

const MotionBox = motion(Box);
const PlayersDeco: React.VFC<{ players: Pick<User, 'id' | 'image' | 'name' | 'roleId'>[] }> = ({ players }) => {
  return (
    <>
      {players?.map(user => {
        const random = Math.random();
        return (
          <MotionBox
            zIndex={0}
            initial={{ translateY: 1000, opacity: 1 }}
            animate={{ translateY: -1000, opacity: 0 }}
            transition={{ repeat: Infinity, duration: random * -6 + 12 }}
            pointerEvents={'none'}
            key={user.id}
            position="relative"
            left={Math.random() * 100 + '%'}
            bottom={0}
            filter={`blur(${random * 4}px)`}
            transform={`scale(${random * 1 + 0.5})`}
            opacity={1.0 - random * 0.9}
          >
            <PlayerAvatar size={16} user={user} />
          </MotionBox>
        );
      })}
    </>
  );
};

export default memo(PlayersDeco);

import { Badge, HStack } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { motion } from 'framer-motion';
import PlayerAvatar from '../PlayerAvatar';
import PlayerLink from '../PlayerLink/PlayerLink';
import { Player } from './PlayerPicker';

type PlayerItemProps = {
  player: Player;
  isSelected?: boolean;
  onSelect?: (id: User['id']) => void;
};
const MotionHStack = motion(HStack);

const PlayerItem: React.VFC<PlayerItemProps> = ({ player, isSelected, onSelect }) => {
  const [score] = player?.scores;
  return (
    <MotionHStack
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layoutId={player.id}
      p={4}
      overflow="hidden"
      bg={isSelected ? 'gray.300' : undefined}
      onClick={() => onSelect?.(player.id)}
      as="button"
      type="button"
    >
      <HStack flexGrow={1} spacing={4} flexShrink={1}>
        <PlayerAvatar user={player} />
        <PlayerLink name={player.name} noOfLines={1} />
      </HStack>
      {score?.points ? <Badge bg={'white'}>{score?.points} pts</Badge> : <Badge>never played</Badge>}
    </MotionHStack>
  );
};

export default PlayerItem;

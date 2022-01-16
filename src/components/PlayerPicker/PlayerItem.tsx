import { Badge, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import PlayerAvatar from '../PlayerAvatar';
import PlayerLink from '../PlayerLink/PlayerLink';
import type { Player } from './types';

type PlayerItemProps = {
  player: Player;
  isSelected?: boolean;
  selectedColour?: string;
  onSelect?: (player: Player) => void;
};
const MotionHStack = motion(HStack);

const PlayerItem: React.VFC<PlayerItemProps> = ({ player, isSelected, onSelect, selectedColour }) => {
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
      bg={isSelected ? selectedColour || '#fbb826' : undefined}
      _hover={{ bg: isSelected ? undefined : 'gray.200' }}
      onClick={() => onSelect?.(player)}
      as="button"
      type="button"
      borderRadius="12"
    >
      <HStack flexGrow={1} spacing={4} flexShrink={1}>
        <PlayerAvatar user={player} />
        <PlayerLink name={player.name} noOfLines={1} />
      </HStack>
      {score?.points ? <Badge bg={'white'}>{score?.points} pts</Badge> : <Badge>never played</Badge>}
    </MotionHStack>
  );
};

export default React.memo(PlayerItem);

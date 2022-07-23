import PlayerName from '@/components/PlayerName';
import type { ChakraProps} from '@chakra-ui/react';
import { Badge, HStack } from '@chakra-ui/react';
import React from 'react';
import PlayerAvatar from '../PlayerAvatar';
import type { Player } from './types';

type PlayerItemProps = {
  player: Player;
  isSelected?: boolean;
  selectedColour?: string;
  onSelect?: (player: Player) => void;
};

const PlayerItem: React.VFC<PlayerItemProps & ChakraProps> = ({
  player,
  isSelected,
  onSelect,
  selectedColour,
  ...delegated
}) => {
  const score = player?.scores?.[0];
  return (
    <HStack
      w="100%"
      p={4}
      overflow="hidden"
      bg={isSelected ? selectedColour || 'primary.9' : undefined}
      color={isSelected ? 'black' : undefined}
      _hover={{ bg: isSelected ? undefined : 'grey.2' }}
      onClick={() => onSelect?.(player)}
      as="button"
      type="button"
      borderRadius="12"
      {...delegated}
    >
      <HStack flexGrow={1} spacing={4} flexShrink={1}>
        <PlayerAvatar user={player} />
        <PlayerName user={player} noOfLines={1} />
      </HStack>
      {score?.points ? (
        <Badge bg={isSelected ? 'white' : undefined} color={isSelected ? 'black' : undefined}>
          {score?.points} pts
        </Badge>
      ) : (
        <Badge>never played</Badge>
      )}
    </HStack>
  );
};

export default React.memo(PlayerItem);

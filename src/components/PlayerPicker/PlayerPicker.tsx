import { sortAlphabetically } from '@/lib/arrays';
import { Box, Button, HStack, Input, Stack, Text } from '@chakra-ui/react';
import { IoSearchCircle } from 'react-icons/io5';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import { groupBy } from 'ramda';
import { useMemo, useState } from 'react';
import PlayerItem from './PlayerItem';
import { Player } from './types';

type PlayerPickerProps = {
  players?: Player[];
  onSelect: (player: Player) => void;
  selectedPlayers?: Player[];
  isLoading?: boolean;
  isError?: boolean;
  selectedColour?: string;
  refetch?: () => void;
};

const groupByFirstLetter = groupBy<Player>(user => user.name?.toLowerCase()[0] || 'other');
const MotionBox = motion(Box);

const PlayerPicker: React.VFC<PlayerPickerProps> = ({
  players,
  onSelect,
  selectedPlayers,
  isLoading,
  isError,
  selectedColour,
  refetch,
}) => {
  const [search, setSearch] = useState<string>('');

  const playersList: [string, Player[]][] = useMemo(
    () =>
      search
        ? [['results', players?.filter(player => player.name?.match(new RegExp(search, 'i'))) || []]]
        : Object.entries(groupByFirstLetter(sortAlphabetically(players || [], player => player.name || ''))),
    [players, search]
  );

  if (isError)
    return (
      <Box p={4} textAlign="center" bg="red.100" borderRadius="xl" color="red.600">
        <Text mb={2}>Error loading players :(</Text>
        {refetch && (
          <Button isLoading={isLoading} onClick={() => refetch()}>
            Retry
          </Button>
        )}
      </Box>
    );

  return (
    <Stack spacing={4} py={1} h="256px" overflow="auto" bg="gray.100" borderRadius="xl">
      <HStack
        mx={1}
        spacing={2}
        bg="white"
        position="sticky"
        top="0"
        zIndex={3}
        borderRadius="12"
        transition=".3s ease-out"
        boxShadow="lg"
      >
        <Box as="label" htmlFor="search" color="gray.500">
          <IoSearchCircle size="32" />
        </Box>
        <Input
          id="search"
          type="text"
          onChange={e => setSearch(e.target.value)}
          placeholder="Type to search…"
          isDisabled={isLoading}
          variant="unstyled"
        />
      </HStack>
      <AnimateSharedLayout>
        {playersList.map(([divider, opponents]) => {
          return (
            <Stack spacing={1} key={divider} px={1}>
              <AnimatePresence initial={false}>
                <MotionBox
                  layout
                  key={divider}
                  layoutId={divider}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  pl={16}
                  py={1}
                  bg="gray.50"
                  color="gray.400"
                  letterSpacing="wider"
                  fontSize="sm"
                  borderRadius="12"
                >
                  {divider.toUpperCase()}
                </MotionBox>
                {opponents.map(user => (
                  <PlayerItem
                    isSelected={!!selectedPlayers?.find(player => player.id === user.id)}
                    selectedColour={selectedColour}
                    player={user}
                    key={user.id}
                    onSelect={onSelect}
                  />
                ))}
              </AnimatePresence>
            </Stack>
          );
        })}
      </AnimateSharedLayout>
    </Stack>
  );
};

export default PlayerPicker;

import { sortAlphabetically } from '@/lib/arrays';
import { ArrayElement } from '@/lib/types/utils';
import { OpponentsAPIResponse } from '@/pages/api/games/[id]/opponents';
import { Box, Button, Input, Stack, Text } from '@chakra-ui/react';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import Fuse from 'fuse.js';
import { groupBy } from 'ramda';
import { useMemo, useState } from 'react';
import PlayerItem from './PlayerItem';

export type Player = ArrayElement<OpponentsAPIResponse['opponents']>;

type PlayerPickerProps = {
  players?: Player[];
  onSelect: (id: Player['id']) => void;
  selectedId?: Player['id'];
  isLoading?: boolean;
  isError?: boolean;
  refetch?: () => void;
};

const groupByFirstLetter = groupBy<Player>(user => user.name?.toLowerCase()[0] || 'other');
const MotionBox = motion(Box);

const PlayerPicker: React.VFC<PlayerPickerProps> = ({ players, onSelect, selectedId, isLoading, isError, refetch }) => {
  const [search, setSearch] = useState<string>('');
  const fuse = useMemo(
    () =>
      new Fuse(players || [], {
        keys: ['name'],
        isCaseSensitive: false,
      }),
    [players]
  );

  const playerList: [string, Player[]][] = search
    ? [
        [
          'results',
          fuse
            .search(search)
            .sort((a, b) => (a.score || 0) - (b.score || 0))
            .map(({ item }) => item),
        ],
      ]
    : Object.entries(groupByFirstLetter(sortAlphabetically(players || [], player => player.name || '')));

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
    <Stack>
      <Input
        type="text"
        onChange={e => setSearch(e.target.value)}
        placeholder="Type to search players"
        isDisabled={isLoading}
      />
      <Stack spacing={0} h="256px" overflow="auto" bg="gray.100" borderRadius="xl">
        <AnimateSharedLayout>
          {playerList.map(([divider, opponents]) => {
            return (
              <Stack spacing={0} key={divider}>
                <AnimatePresence>
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
                  >
                    {divider.toUpperCase()}
                  </MotionBox>
                  {opponents.map(user => (
                    <PlayerItem isSelected={selectedId === user.id} player={user} key={user.id} onSelect={onSelect} />
                  ))}
                </AnimatePresence>
              </Stack>
            );
          })}
        </AnimateSharedLayout>
      </Stack>
    </Stack>
  );
};

export default PlayerPicker;
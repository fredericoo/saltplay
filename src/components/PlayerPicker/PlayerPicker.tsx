import { sortAlphabetically } from '@/lib/arrays';
import { Box, Button, Center, HStack, Text } from '@chakra-ui/react';
import { groupBy } from 'ramda';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useVirtual } from 'react-virtual';
import LoadingIcon from '../LoadingIcon';
import PlayerItem from './PlayerItem';
import SearchField from './SearchField';
import { Player } from './types';

export type PlayerPickerProps = {
  players?: Player[];
  isAlphabetical?: boolean;
  onSelect: (player: Player) => void;
  selectedPlayers?: Player[];
  isLoading?: boolean;
  isError?: boolean;
  selectedColour?: string;
  refetch?: () => void;
};

type GetResults = <T>(options: { list: T[]; search?: string; getterFn: (element: T) => string }) => T[];

const getResults: GetResults = ({ search, list, getterFn }) => {
  const searchString = search?.replace(/[^a-zA-Z0-9]/g, '');
  if (!searchString) return list;
  return (
    list?.filter(item =>
      getterFn(item)
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[^a-zA-Z0-9]/, '')
        .match(searchString)
    ) || []
  );
};

const groupByFirstLetter = groupBy<Player>(element => element.name?.charAt(0).toUpperCase() || '?');

const PlayerPicker: React.VFC<PlayerPickerProps> = ({
  players,
  isAlphabetical,
  onSelect,
  selectedPlayers,
  isLoading,
  isError,
  selectedColour,
  refetch,
}) => {
  const [search, setSearch] = useState<string>('');
  const list = useMemo(() => {
    const results = getResults({ list: players || [], search, getterFn: player => player.name || '' });
    if (isAlphabetical) {
      const sortedPlayers = sortAlphabetically(results, player => player.name || '?');
      return Object.entries(groupByFirstLetter(sortedPlayers)).flat(2);
    }
    return results;
  }, [isAlphabetical, players, search]);

  const groupIndexes = useMemo(
    () =>
      list.reduce<{ text: string; index: number }[]>(
        (acc, cur, index) => (typeof cur === 'string' ? [...acc, { text: cur, index }] : acc),
        []
      ),
    [list]
  );

  const virtualiserRef = useRef<HTMLDivElement>(null);
  const rowVirtualiser = useVirtual({
    size: list?.length || 0,
    parentRef: virtualiserRef,
    estimateSize: useCallback(index => (typeof list[index] === 'string' ? 30 : 66), [list]),
    overscan: 5,
  });

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

  if (isLoading) {
    return (
      <Center bg="gray.100" h="256px" borderRadius="xl" position="relative">
        <LoadingIcon color="gray.400" size={12} />
      </Center>
    );
  }

  return (
    <Box bg="gray.100" h="256px" borderRadius="xl" position="relative" ref={virtualiserRef} overflow="auto" p="3px">
      <SearchField search={search} setSearch={setSearch} position="sticky" top="3px" mb="6px" />
      {groupIndexes.length > 10 && (
        <HStack py={2} overflow="auto">
          {groupIndexes.map(({ text, index }) => (
            <Box
              as="button"
              type="button"
              onClick={() => {
                rowVirtualiser.scrollToIndex(index, { align: 'start' });
              }}
              key={index}
              px={2}
              py={1}
              bg="gray.200"
              borderRadius="md"
              fontSize="xs"
              fontWeight="bold"
            >
              {text}
            </Box>
          ))}
        </HStack>
      )}
      <Box w="100%" h={`${rowVirtualiser.totalSize}px`} position="relative">
        {rowVirtualiser.virtualItems.map(virtualRow => {
          const row = list[virtualRow.index];
          if (typeof row === 'string')
            return (
              <Box
                key={virtualRow.index}
                pl={16}
                py={1}
                bg="gray.50"
                color="gray.400"
                letterSpacing="wider"
                fontSize="sm"
                borderRadius="12"
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h={`${virtualRow.size}px`}
                transform={`translateY(${virtualRow.start}px)`}
              >
                {row.toUpperCase()}
              </Box>
            );

          return (
            <PlayerItem
              key={virtualRow.index}
              isSelected={!!selectedPlayers?.find(player => player.id === row.id)}
              selectedColour={selectedColour}
              player={row}
              position="absolute"
              top={0}
              left={0}
              w="100%"
              h={`${virtualRow.size}px`}
              transform={`translateY(${virtualRow.start}px)`}
              onSelect={player => {
                onSelect(player);
                setSearch('');
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default PlayerPicker;

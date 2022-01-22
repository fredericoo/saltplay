import { sortAlphabetically } from '@/lib/arrays';
import { Box, Button, Text } from '@chakra-ui/react';
import { groupBy } from 'ramda';
import { useMemo, useState } from 'react';
import PlayerItem from './PlayerItem';
import { Player } from './types';
import { AutoSizer, List } from 'react-virtualized';
import SearchField from './SearchField';

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
type ListRow = string | Player;

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

  const list = useMemo(() => {
    if (search) {
      const searchString = search.replace(/[^a-zA-Z0-9]/g, '');
      const results = players?.filter(player => player.name?.normalize('NFD').toLowerCase().match(searchString)) || [];
      return ['results', ...results];
    }
    const sortedPlayers = sortAlphabetically(players || [], player => player.name || '');
    return Object.entries(groupByFirstLetter(sortedPlayers)).reduce<ListRow[]>(
      (acc, [letter, players]) => [...acc, letter, ...players],
      []
    );
  }, [players, search]);

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
    <Box bg="gray.100" h="256px" borderRadius="xl" position="relative">
      <SearchField search={search} setSearch={setSearch} />
      <AutoSizer>
        {({ height, width }) => (
          <List
            style={{ borderRadius: '16px', padding: '3px' }}
            width={width}
            height={height}
            rowHeight={({ index }) => (typeof (list[index] as ListRow) === 'string' ? 35 : 66)}
            rowCount={list.length}
            rowRenderer={({ index, key, style }) => {
              const row = list[index];
              if (typeof row === 'string') {
                return (
                  <Box
                    key={key}
                    style={style}
                    pl={16}
                    py={1}
                    bg="gray.50"
                    color="gray.400"
                    letterSpacing="wider"
                    fontSize="sm"
                    borderRadius="12"
                  >
                    {row.toUpperCase()}
                  </Box>
                );
              }
              return (
                <div style={style}>
                  <PlayerItem
                    key={key}
                    isSelected={!!selectedPlayers?.find(player => player.id === row.id)}
                    selectedColour={selectedColour}
                    player={row}
                    onSelect={player => {
                      onSelect(player);
                      setSearch('');
                    }}
                  />
                </div>
              );
            }}
          />
        )}
      </AutoSizer>
    </Box>
  );
};

export default PlayerPicker;

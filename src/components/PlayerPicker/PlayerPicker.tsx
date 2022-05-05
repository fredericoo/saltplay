import { sortAlphabetically } from '@/lib/arrays';
import hideScrollbar from '@/lib/styleUtils';
import { Box, Button, Center, HStack, Text } from '@chakra-ui/react';
import { groupBy } from 'ramda';
import { useCallback, useMemo, useRef, useState } from 'react';
import { IoCloseCircleOutline, IoSearchCircle } from 'react-icons/io5';
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
  const searchString = search
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[^a-zA-Z0-9]/g, '');
  if (!searchString) return list;
  return (
    list?.filter(item =>
      getterFn(item)
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[^a-zA-Z0-9]/g, '')
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
  const [isSearching, setIsSearching] = useState(false);
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
        (acc, cur, index) =>
          typeof cur === 'string' && cur.replace(/[^a-zA-Z0-9]/g, '').length > 0 ? [...acc, { text: cur, index }] : acc,
        []
      ),
    [list]
  );

  const virtualiserRef = useRef<HTMLDivElement>(null);
  const rowVirtualiser = useVirtual({
    size: list?.length || 0,
    parentRef: virtualiserRef,
    estimateSize: useCallback(index => (typeof list[index] === 'string' ? 33 : 66), [list]),
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
      <Center bg="grey.4" h="256px" borderRadius="xl" position="relative">
        <LoadingIcon color="grey.9" size={12} />
      </Center>
    );
  }

  return (
    <Box bg="grey.4" h="256px" borderRadius="xl" position="relative" ref={virtualiserRef} overflow="auto" px="3px">
      <Box
        borderTopRadius="xl"
        as="nav"
        position="sticky"
        top="0"
        zIndex="sticky"
        bg="grey.6"
        mx="-3px"
        overflow="hidden"
        borderBottom="1px solid"
        borderColor="grey.7"
      >
        {isSearching && (
          <SearchField mb="2" top="4px" position="sticky" focusOnMount search={search} setSearch={setSearch} />
        )}
        <HStack display="flex" overflow="auto" css={hideScrollbar} pl={1} pr={4} py="1">
          <Box
            position="sticky"
            left="0"
            as="button"
            type="button"
            color="grey.11"
            borderRadius="full"
            bg="grey.6"
            mr="2"
            boxShadow="0px 0px 8px 12px var(--wrkplay-colors-grey-6)"
            _hover={{ color: 'grey.12' }}
            onClick={() => {
              setIsSearching(!isSearching);
              setSearch('');
            }}
          >
            {isSearching ? <IoCloseCircleOutline size="28" /> : <IoSearchCircle size="32" />}
          </Box>
          {groupIndexes.map(({ text, index }) => (
            <Box
              flexShrink={0}
              as="button"
              type="button"
              onClick={() => {
                rowVirtualiser.scrollToIndex(index, { align: 'start' });
              }}
              key={index}
              width={'2rem'}
              py={1}
              bg="grey.2"
              _hover={{ bg: 'grey.1' }}
              boxShadow="sm"
              borderRadius="md"
              fontSize="sm"
              color="grey.11"
              fontWeight="bold"
            >
              {text}
            </Box>
          ))}
        </HStack>
      </Box>

      <Box w="100%" h={`${rowVirtualiser.totalSize}px`} position="relative">
        {rowVirtualiser.virtualItems.map(virtualRow => {
          const row = list[virtualRow.index];
          if (typeof row === 'string')
            return (
              <Box
                mt="1px"
                key={virtualRow.index}
                pl={16}
                py={1}
                bg="grey.2"
                color="grey.10"
                fontWeight="bold"
                letterSpacing="wider"
                fontSize="sm"
                borderRadius="12"
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h={`${virtualRow.size - 4}px`}
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
              mt="1px"
              h={`${virtualRow.size - 4}px`}
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

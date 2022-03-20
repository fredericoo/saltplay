import ErrorBox from '@/components/ErrorBox';
import PlayerAvatar from '@/components/PlayerAvatar';
import PlayerPicker from '@/components/PlayerPicker';
import { Player } from '@/components/PlayerPicker/types';
import PointIcon from '@/components/PointIcon';
import { STARTING_POINTS } from '@/constants';
import fetcher from '@/lib/fetcher';
import { OpponentsAPIResponse } from '@/pages/api/games/[id]/opponents';
import getGradientFromId from '@/theme/palettes';
import { Badge, Box, Circle, HStack, Skeleton, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { Game } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import useSWR from 'swr';
import InvitePicker from '../InvitePicker';
import { MatchFormInputs } from '../NewMatchButton';

type TeamsProps = {
  gameId: Game['id'];
  maxPlayersPerTeam: number;
  onFinish?: () => void;
};

const MotionBox = motion(Box);

const Teams: React.VFC<TeamsProps> = ({ gameId, maxPlayersPerTeam, onFinish }) => {
  const {
    data: opponentsQuery,
    error: opponentsError,
    mutate,
  } = useSWR<OpponentsAPIResponse>(`/api/games/${gameId}/opponents`, fetcher, { revalidateOnFocus: false });

  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | undefined>(undefined);

  const { data: session } = useSession();
  const { register, watch, setValue } = useFormContext<MatchFormInputs>();
  const [left, right] = watch(['left', 'right']);
  const sides = { left, right };

  const teamSize = Math.max(left?.length, right?.length, 1);
  const players =
    session?.user.roleId === 0
      ? opponentsQuery?.opponents
      : opponentsQuery?.opponents?.filter(({ id }) => id !== session?.user.id);
  const thisPlayer = opponentsQuery?.opponents?.find(({ id }) => id === session?.user.id);
  register('right', { required: true, value: [] });
  register('left', { required: true, value: [] });

  useEffect(() => {
    session?.user.roleId !== 0 &&
      thisPlayer &&
      !left?.find(player => player.id === thisPlayer.id) &&
      setValue('left', [thisPlayer]);
  }, [left, session, setValue, thisPlayer]);

  const handleSelect = (user: Player) => {
    if (!selectedSide) return;
    let newValue: Player[];
    const side = sides[selectedSide];
    if (side.find(player => player.id === user.id)) {
      newValue = side.filter(player => player.id !== user.id);
    } else if (side.length >= (maxPlayersPerTeam || 0)) {
      newValue = [...side.slice(0, -1), user];
    } else {
      newValue = [...side, user];
    }
    setValue(selectedSide, newValue);
    if (newValue.length === maxPlayersPerTeam) {
      if (selectedSide === 'left') {
        setSelectedSide('right');
        return;
      }
      setSelectedSide(undefined);
      onFinish?.();
    }
  };

  const handleSelectedSide = (side: 'left' | 'right') => {
    if (side === 'left' && maxPlayersPerTeam === 1) return;

    if (selectedSide === side) {
      setSelectedSide(undefined);
      return;
    }
    setSelectedSide(side);
  };

  if (opponentsError || opponentsQuery?.status === 'error')
    return <ErrorBox heading={["Couldn't load opponents", opponentsQuery?.message].join(': ')} />;

  if (!opponentsQuery)
    return (
      <HStack as="aside" spacing={1} mb={4}>
        <Skeleton flex={1} h="146px" borderRadius="lg" />
        <Badge>Vs</Badge>
        <Skeleton flex={1} h="146px" borderRadius="lg" />
      </HStack>
    );

  return (
    <Box>
      <HStack as="aside" spacing={-1} mb={4}>
        <Side
          label={maxPlayersPerTeam === 1 ? 'You' : 'Your team'}
          isReverse
          players={left}
          isSelected={selectedSide === 'left'}
          onClick={() => handleSelectedSide('left')}
          selectedColour={getGradientFromId('1')}
          emptySlots={teamSize - left?.length}
        />
        <Badge variant="solid" colorScheme="danger" zIndex="docked">
          Vs
        </Badge>
        <Side
          label={maxPlayersPerTeam === 1 ? 'Opponent' : 'Opposing team'}
          players={right}
          isSelected={selectedSide === 'right'}
          onClick={() => handleSelectedSide('right')}
          selectedColour={getGradientFromId('4')}
          emptySlots={teamSize - right?.length}
        />
      </HStack>
      <AnimatePresence initial={false}>
        {selectedSide && (
          <MotionBox
            key={selectedSide}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            overflow="hidden"
          >
            <Tabs isLazy>
              <TabList mb="2">
                <Tab>Players</Tab>
                <Tab>Invite</Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  <PlayerPicker
                    players={players?.filter(
                      ({ id }) => !sides[selectedSide === 'left' ? 'right' : 'left'].find(player => player.id === id)
                    )}
                    isAlphabetical
                    selectedPlayers={sides[selectedSide]}
                    refetch={mutate}
                    isLoading={!opponentsQuery}
                    isError={opponentsError}
                    onSelect={handleSelect}
                    selectedColour={selectedSide === 'left' ? getGradientFromId('1') : getGradientFromId('4')}
                  />
                </TabPanel>
                <TabPanel px={0}>
                  <InvitePicker
                    selectedPlayers={sides[selectedSide]}
                    onSelect={handleSelect}
                    selectedColour={selectedSide === 'left' ? getGradientFromId('1') : getGradientFromId('4')}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
            {maxPlayersPerTeam > 1 && (
              <Text mt={2} textAlign="center" fontSize="small" color="grey.10">
                Select up to {maxPlayersPerTeam} players
              </Text>
            )}
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

type SideProps = {
  label: string;
  players?: Player[];
  isReverse?: boolean;
  isSelected?: boolean;
  onClick: () => void;
  selectedColour?: string;
  emptySlots: number;
};

const Side: React.VFC<SideProps> = ({
  label,
  players,
  isReverse,
  isSelected,
  onClick,
  selectedColour,
  emptySlots = 0,
}) => {
  const paddingAvatars = emptySlots > 0 ? new Array(emptySlots).fill({ id: '0', name: '+' }) : [];
  const teamAveragePoints = players
    ? Math.ceil(
        players?.reduce((acc, cur) => acc + (('scores' in cur && cur.scores?.[0]?.points) || STARTING_POINTS), 0) /
          players?.length
      ) || 0
    : 0;

  return (
    <Box
      as="button"
      type="button"
      flex={1}
      bg={isSelected ? 'grey.4' : undefined}
      transition=".3s ease-in-out"
      borderRadius="xl"
      p={2}
      onClick={onClick}
    >
      <HStack flexFlow={isReverse ? 'row-reverse' : undefined}>
        <Text as="h2" color={isSelected ? 'grey.12' : 'grey.10'} fontWeight="bold">
          {label}
        </Text>
      </HStack>
      <HStack flexFlow={isReverse ? 'row-reverse' : undefined} spacing={0} minH="76px">
        <AnimatePresence initial={false}>
          {players?.map((player, index) => (
            <MotionBox
              flex={1}
              maxW="25%"
              ml={isReverse ? -2 : 0}
              mr={isReverse ? 0 : -2}
              key={index}
              zIndex={paddingAvatars.length + players.length - index}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <PlayerAvatar user={player} size={'100%'} />
            </MotionBox>
          ))}
          {paddingAvatars.map((_, index) => (
            <MotionBox
              flex={1}
              maxW="25%"
              ml={isReverse ? -2 : 0}
              mr={isReverse ? 0 : -2}
              key={(players?.length || 0) + index}
              zIndex={paddingAvatars.length - index}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Circle bg="grey.3" pb="100%" w="100%" h="0" position="relative" boxShadow="0 0 0 3px white">
                <Box
                  position="absolute"
                  inset="0"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  fontSize="2xl"
                  lineHeight={1}
                  color="grey.10"
                >
                  +
                </Box>
              </Circle>
            </MotionBox>
          ))}
        </AnimatePresence>
      </HStack>
      <HStack mt={2} flexFlow={isReverse ? 'row-reverse' : undefined}>
        <Badge variant="subtle" colorScheme="grey" bg="grey.1">
          {teamAveragePoints} <PointIcon bg="grey.8" /> {(players?.length || 0) > 1 ? 'avg.' : ' '}
        </Badge>
      </HStack>
    </Box>
  );
};

export default Teams;

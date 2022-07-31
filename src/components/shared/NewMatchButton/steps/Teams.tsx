import ErrorBox from '@/components/shared/ErrorBox';
import useOpponents from '@/components/shared/Leaderboard/useOpponents';
import { MotionBox } from '@/components/shared/Motion';
import PlayerPicker from '@/components/shared/NewMatchButton/PlayerPicker';
import type { Player } from '@/components/shared/NewMatchButton/PlayerPicker/types';
import { BANNED_ROLE_ID } from '@/constants';
import { canViewDashboard } from '@/lib/roles';
import getGradientFromId from '@/theme/palettes';
import { Badge, Box, HStack, Skeleton, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import type { Game, Season } from '@prisma/client';
import { AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import InvitePicker from '../InvitePicker';
import type { MatchFormInputs } from '../NewMatchButton';
import Side from '../Side';

type TeamsProps = {
  gameId: Game['id'];
  seasonId: Season['id'];
  maxPlayersPerTeam: number;
  onFinish?: () => void;
};

const Teams: React.VFC<TeamsProps> = ({ gameId, seasonId, maxPlayersPerTeam, onFinish }) => {
  const { data: session } = useSession();
  const { data: opponentsQuery, error: opponentsError, mutate } = useOpponents({ gameId, seasonId });

  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | undefined>(undefined);

  const { register, watch, setValue } = useFormContext<MatchFormInputs>();
  const [left, right] = watch(['left', 'right']);
  const sides = { left, right };

  const teamSize = Math.max(left?.length, right?.length, 1);
  const players = useMemo(() => {
    const opponents = opponentsQuery?.data?.opponents.filter(opponent => opponent.roleId !== BANNED_ROLE_ID);
    if (session?.user.roleId !== 0) return opponents?.filter(({ id }) => id !== session?.user.id);
    return opponents;
  }, [opponentsQuery?.data?.opponents, session?.user.id, session?.user.roleId]);

  const thisPlayer = opponentsQuery?.data?.opponents?.find(({ id }) => id === session?.user.id);
  register('right', { required: true, value: [] });
  register('left', { required: true, value: [] });

  useEffect(() => {
    !canViewDashboard(session?.user.roleId) &&
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

  const handleSelectSide = (side: 'left' | 'right') => {
    if (side === 'left' && maxPlayersPerTeam === 1 && !canViewDashboard(session?.user.roleId)) return;

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
          onClick={() => handleSelectSide('left')}
          emptySlots={teamSize - left?.length}
        />
        <Badge variant="solid" colorScheme="danger" zIndex="docked">
          Vs
        </Badge>
        <Side
          label={maxPlayersPerTeam === 1 ? 'Opponent' : 'Opposing team'}
          players={right}
          isSelected={selectedSide === 'right'}
          onClick={() => handleSelectSide('right')}
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

export default Teams;

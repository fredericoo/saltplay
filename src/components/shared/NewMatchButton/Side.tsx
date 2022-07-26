import { MotionBox } from '@/components/shared/Motion';
import PlayerAvatar from '@/components/shared/PlayerAvatar';
import PointIcon from '@/components/shared/PointIcon';
import { STARTING_POINTS } from '@/constants';
import { hasKey } from '@/lib/types/utils';
import { Badge, Box, HStack, Text } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import type { Player } from './PlayerPicker/types';

type SideProps = {
  label: string;
  players?: Player[];
  isReverse?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  emptySlots?: number;
};

const Side: React.VFC<SideProps> = ({ label, players, isReverse, isSelected, onClick, emptySlots = 0 }) => {
  const paddingAvatars = emptySlots > 0 ? new Array(emptySlots).fill({ id: '0', name: '+' }) : [];
  const teamAveragePoints = players
    ? Math.ceil(
        players?.reduce(
          (acc, cur) => acc + ((cur && hasKey(cur, 'scores') && cur.scores?.[0]?.points) || STARTING_POINTS),
          0
        ) / players?.length
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
              <Box
                bg="grey.3"
                pb="100%"
                w="100%"
                h="0"
                borderRadius="full"
                position="relative"
                boxShadow="0 0 0 3px var(--wrkplay-colors-grey-4)"
              >
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
              </Box>
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

export default Side;

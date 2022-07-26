import { MotionBox } from '@/components/shared/Motion';
import Side from '@/components/shared/NewMatchButton/Side';
import type { getPlayerSample } from '@/lib/home';
import { Modal } from '@/theme/components/Modal';
import { Badge, Box, Heading, HStack, Input, useColorMode } from '@chakra-ui/react';
import { useMachine } from '@xstate/react';
import { AnimatePresence } from 'framer-motion';
import Section from '../Section';
import matchBlockMachine from './matchBlockMachine';

type AddMatchBlockProps = {
  players: Awaited<ReturnType<typeof getPlayerSample>>;
};

const AddMatchBlock: React.VFC<AddMatchBlockProps> = ({ players }) => {
  const [state] = useMachine(matchBlockMachine, {
    context: {
      players,
    },
  });
  const { colorMode } = useColorMode();

  const colors = {
    success: colorMode === 'light' ? 'success.4' : 'success.12',
    danger: colorMode === 'light' ? 'danger.4' : 'danger.12',
  };

  return (
    <Section
      pb={{ base: '80%', md: 'inherit' }}
      bg={
        state.matches('showing results')
          ? state.context.scores.left > state.context.scores.right
            ? colors.success
            : colors.danger
          : undefined
      }
      css={{ perspective: '1000px' }}
      transition="background-color .3s ease-in-out"
    >
      <Heading as="h2" color="grey.11" size="md" p={4}>
        Register any match in less than 30 seconds
      </Heading>
      <AnimatePresence initial={false}>
        <MotionBox
          position="absolute"
          key={state.context.iteration}
          initial={{ opacity: 0, translateY: 300, rotateY: -40 }}
          animate={{
            opacity: 1,
            translateY: 0,
            transition: { duration: 0.5 },
          }}
          exit={{
            opacity: 0,
            translateY: -300,
            transition: { duration: 0.5 },
          }}
          {...Modal.variants.custom.dialog}
          w="80%"
          minW="300px"
          left="10%"
          top="25%"
          p={4}
          pointerEvents="none"
          aria-hidden
        >
          <HStack as="aside" spacing={-1} mb={4}>
            <Side
              label="Your team"
              players={state.context.teams.left || []}
              emptySlots={1}
              isReverse
              isSelected={state.context.selectedSide === 'left'}
            />
            <Badge variant="solid" colorScheme="danger" zIndex="docked">
              Vs
            </Badge>
            <Side
              label="Opposing team"
              players={state.context.teams.right || []}
              emptySlots={1}
              isSelected={state.context.selectedSide === 'right'}
            />
          </HStack>
          <HStack spacing={8}>
            <Box flex={1} position="relative">
              <Badge position="absolute" left="50%" transform="translate(-50%, -50%)" zIndex={2}>
                Score
              </Badge>
              <Input as="div" py={4} h="auto" fontSize="xl" textAlign="center">
                {state.context.scores.left}
              </Input>
            </Box>
            <Box flex={1} position="relative">
              <Badge position="absolute" left="50%" transform="translate(-50%, -50%)" zIndex={2}>
                Score
              </Badge>
              <Input as="div" py={4} h="auto" fontSize="xl" textAlign="center">
                {state.context.scores.right}
              </Input>
            </Box>
          </HStack>
        </MotionBox>
      </AnimatePresence>
    </Section>
  );
};

export default AddMatchBlock;

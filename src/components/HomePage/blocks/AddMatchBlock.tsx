import { MotionBox } from '@/components/shared/Motion';
import type { Player } from '@/components/shared/NewMatchButton/PlayerPicker/types';
import Side from '@/components/shared/NewMatchButton/Side';
import type { getPlayerSample } from '@/lib/home';
import { Modal } from '@/theme/components/Modal';
import { Badge, Box, Heading, HStack, Input, useColorMode } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Section from '../Section';

type AddMatchBlockProps = {
  players: Awaited<ReturnType<typeof getPlayerSample>>;
};

const AddMatchBlock: React.FC<AddMatchBlockProps> = ({ players }) => {
  const [iteration, setIteration] = useState(0);
  const [step, setStep] = useState(0);
  const { colorMode } = useColorMode();
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | undefined>(undefined);
  const [teamsComp, setTeamsComp] = useState<Record<'left' | 'right', Player[]>>({ left: [], right: [] });
  const [teamsScores, setTeamsScores] = useState<Record<'left' | 'right', number>>({ left: 0, right: 0 });
  const [bgColor, setBgColor] = useState(false);

  const colors = {
    success: colorMode === 'light' ? 'success.4' : 'success.12',
    danger: colorMode === 'light' ? 'danger.4' : 'danger.12',
  };

  useEffect(() => {
    if (players) {
      switch (step) {
        case 1:
          setIteration(iteration + 1);
          setSelectedSide('left');
          setTeamsComp({ left: [], right: [] });
          setTeamsScores({ left: 0, right: 0 });
          setBgColor(false);
          break;
        case 2:
          setTeamsComp({ left: [players?.[0]], right: [] });
          break;
        case 3:
          setTeamsComp(comp => ({ left: [...comp.left, players[2]], right: [] }));
          break;
        case 4:
          setSelectedSide('right');
          break;
        case 5:
          setTeamsComp(comp => ({ left: comp.left, right: [players?.[1]] }));
          break;
        case 6:
          setTeamsComp(comp => ({ left: comp.left, right: [...comp.right, players?.[3]] }));
          break;
        case 7:
          setSelectedSide(undefined);
          break;
        case 8:
          setTeamsScores({ left: Math.ceil(Math.random() * 8), right: 0 });
          break;
        case 9:
          setTeamsScores(scores => ({ left: scores.left, right: Math.ceil(Math.random() * 8) }));
          break;
        case 10:
          setBgColor(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    const skipStep = () => (step < 10 ? setStep(step => step + 1) : setStep(0));
    const timeout = setTimeout(skipStep, 500);
    return () => clearTimeout(timeout);
  }, [step]);

  return (
    <Section
      pb={{ base: '80%', md: 'inherit' }}
      bg={
        teamsScores.left === teamsScores.right || !bgColor
          ? undefined
          : teamsScores.left > teamsScores.right
          ? colors.success
          : colors.danger
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
          key={iteration}
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
              players={teamsComp.left}
              emptySlots={1}
              isReverse
              isSelected={selectedSide === 'left'}
            />
            <Badge variant="solid" colorScheme="danger" zIndex="docked">
              Vs
            </Badge>
            <Side
              label="Opposing team"
              players={teamsComp.right}
              emptySlots={1}
              isSelected={selectedSide === 'right'}
            />
          </HStack>
          <HStack spacing={8}>
            <Box flex={1} position="relative">
              <Badge position="absolute" left="50%" transform="translate(-50%, -50%)" zIndex={2}>
                Score
              </Badge>
              <Input as="div" py={4} h="auto" fontSize="xl" textAlign="center">
                {teamsScores.left}
              </Input>
            </Box>
            <Box flex={1} position="relative">
              <Badge position="absolute" left="50%" transform="translate(-50%, -50%)" zIndex={2}>
                Score
              </Badge>
              <Input as="div" py={4} h="auto" fontSize="xl" textAlign="center">
                {teamsScores.right}
              </Input>
            </Box>
          </HStack>
        </MotionBox>
      </AnimatePresence>
    </Section>
  );
};

export default AddMatchBlock;

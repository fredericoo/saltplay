import { getPlayerSample } from '@/lib/home';
import { Modal } from '@/theme/components/Modal';
import { Badge, Box, Heading, HStack, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Side from '../NewMatchButton/Side';
import { Player } from '../PlayerPicker/types';
import Section from './Section';

type AddMatchBlockProps = {
  players: Awaited<ReturnType<typeof getPlayerSample>>;
};

const AddMatchBlock: React.VFC<AddMatchBlockProps> = ({ players }) => {
  const [step, setStep] = useState(0);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | undefined>(undefined);
  const [teamsComp, setTeamsComp] = useState<Record<'left' | 'right', Player[]>>({ left: [], right: [] });
  const [teamsScores, setTeamsScores] = useState<Record<'left' | 'right', number>>({ left: 0, right: 0 });
  const [bgColor, setBgColor] = useState(false);

  useEffect(() => {
    if (!players) return;
    switch (step) {
      case 1:
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    const skipStep = () => (step < 10 ? setStep(step => step + 1) : setStep(0));
    setTimeout(skipStep, 500);
    return () => clearTimeout(500);
  }, [step]);

  return (
    <Section
      bg={
        teamsScores.left === teamsScores.right || !bgColor
          ? undefined
          : teamsScores.left > teamsScores.right
          ? 'success.4'
          : 'danger.4'
      }
    >
      <Heading as="h2" color="grey.11" fontSize="2xl" p={4}>
        Register any match in less than 30 seconds
      </Heading>
      <Box
        {...Modal.variants.custom.dialog}
        transform={{ md: 'translate(25%, 25%)' }}
        w="80%"
        minW="400px"
        mx="auto"
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
          <Side label="Opposing team" players={teamsComp.right} emptySlots={1} isSelected={selectedSide === 'right'} />
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
      </Box>
    </Section>
  );
};

export default AddMatchBlock;

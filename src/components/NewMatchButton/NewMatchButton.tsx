import { MatchesPOSTAPIResponse } from '@/lib/api/handlers/postMatchesHandler';
import {
  Button,
  ButtonProps,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Game, Match } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { IoAddCircleOutline } from 'react-icons/io5';
import useLatestMatches from '../LatestMatches/useLatestMatches';
import useLeaderboard from '../Leaderboard/useLeaderboard';
import LoadingIcon from '../LoadingIcon';
import { Player } from '../PlayerPicker/types';
import Toast from '../Toast';
import Scores from './steps/Scores';
import Teams from './steps/Teams';

type NewMatchButtonProps = {
  gameId: Game['id'];
  maxPlayersPerTeam?: Game['maxPlayersPerTeam'];
  onSubmitSuccess?: () => void;
};

export type MatchFormInputs = Pick<Match, 'leftscore' | 'rightscore'> & {
  right: Player[];
  left: Player[];
};

const NewMatchButton: React.VFC<NewMatchButtonProps & ButtonProps> = ({
  gameId,
  maxPlayersPerTeam,
  ...chakraProps
}) => {
  const { status } = useSession();
  const { mutate: mutateLatestMatches } = useLatestMatches({ gameId });
  const { mutate: mutateLeaderboard } = useLeaderboard({ gameId });
  const isLoggedIn = status === 'authenticated';
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const form = useForm<MatchFormInputs>();
  const toast = useToast();
  if (!isLoggedIn)
    return (
      <Button w="100%" variant="solid" bg="gray.300" _hover={{ bg: 'gray.300' }} isDisabled onClick={onOpen}>
        Sign in to submit a match!
      </Button>
    );

  const onSubmit = async (data: MatchFormInputs) => {
    setIsLoading(true);

    const req = {
      left: {
        players: data.left.map(({ id, source }) => ({ id, source: source || 'user' })),
        score: data.leftscore,
      },
      right: {
        players: data.right.map(({ id, source }) => ({ id, source: source || 'user' })),
        score: data.rightscore,
      },
      gameId,
    };
    try {
      const res = await axios.post<MatchesPOSTAPIResponse>('/api/matches', req).then(res => res.data);

      if (res.status !== 'ok') throw new Error('Error creating match');
      toast({
        render: () => <Toast status="success" heading="Well done" content="Your match has been added." />,
        position: 'bottom',
      });
      form.reset();
      mutateLatestMatches();
      mutateLeaderboard();
    } catch {
      toast({
        render: () => (
          <Toast status="error" heading="Let’s try that again" content="An error occurred when adding your match." />
        ),
        position: 'bottom',
      });
      return;
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <>
      <Button
        w="100%"
        variant="primary"
        size="lg"
        onClick={onOpen}
        leftIcon={<IoAddCircleOutline size={24} />}
        {...chakraProps}
      >
        Submit new match
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit match results</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormProvider {...form}>
              <form id="new-match" onSubmit={form.handleSubmit(onSubmit)}>
                {isLoading ? (
                  <Center py={16}>
                    <LoadingIcon color="gray.400" size={16} />
                  </Center>
                ) : (
                  <Stack spacing={8}>
                    <Teams gameId={gameId} maxPlayersPerTeam={maxPlayersPerTeam || 1} />
                    <Scores />
                  </Stack>
                )}
              </form>
            </FormProvider>
          </ModalBody>

          <ModalFooter pb={6} flexDir="column">
            <Button variant="primary" flexGrow="1" type="submit" form="new-match" w="100%">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewMatchButton;

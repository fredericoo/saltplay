import { MatchesPOSTAPIResponse } from '@/lib/api/handlers/match/postMatchesHandler';
import { trackEvent } from '@/lib/mixpanel';
import {
  Button,
  ButtonProps,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Game, Match, Season } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { IoAddCircleOutline } from 'react-icons/io5';
import useLatestMatches from '../LatestMatches/useLatestMatches';
import useLeaderboard from '../Leaderboard/useLeaderboard';
import useOpponents from '../Leaderboard/useOpponents';
import LoadingIcon from '../LoadingIcon';
import { Player } from '../PlayerPicker/types';
import Toast from '../Toast';

const Teams = dynamic(() => import('./steps/Teams'), {
  ssr: false,
  loading: () => <LoadingIcon color="grey.4" size={4} />,
});
const Scores = dynamic(() => import('./steps/Scores'), { ssr: false });

type NewMatchButtonProps = {
  gameId: Game['id'];
  seasonId: Season['id'];
  maxPlayersPerTeam?: Game['maxPlayersPerTeam'];
  onSubmitSuccess?: () => void;
};

export type MatchFormInputs = Pick<Match, 'leftscore' | 'rightscore'> & {
  right: Player[];
  left: Player[];
};

const NewMatchButton: React.VFC<NewMatchButtonProps & ButtonProps> = ({
  gameId,
  seasonId,
  maxPlayersPerTeam,
  ...chakraProps
}) => {
  const { status } = useSession();
  const { mutate: mutateLatestMatches } = useLatestMatches({ gameId });
  const { mutate: mutateLeaderboard } = useLeaderboard({ gameId });
  const { mutate: mutateOpponents } = useOpponents({ gameId });
  const isLoggedIn = status === 'authenticated';
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const form = useForm<MatchFormInputs>();
  const toast = useToast();
  if (!isLoggedIn)
    return (
      <Button w="100%" bg="grey.4" size="lg" isDisabled {...chakraProps}>
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
      seasonId,
    };
    try {
      const res = await axios.post<MatchesPOSTAPIResponse>('/api/matches', req).then(res => res.data);

      if (res.status !== 'ok') throw new Error('Error creating match');
      toast({
        render: () => <Toast status="success" heading="Well done" content="Your match has been added." />,
        position: 'bottom',
      });
      trackEvent('Match created', {
        gameId,
        left: data.left.map(({ id }) => id),
        right: data.right.map(({ id }) => id),
        leftscore: data.leftscore,
        rightscore: data.rightscore,
      });
      form.resetField('leftscore');
      form.resetField('rightscore');
      mutateLatestMatches();
      mutateLeaderboard();
      mutateOpponents();
    } catch {
      trackEvent('Error creating match');
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
          <ModalCloseButton />
          <ModalBody pt={6}>
            <FormProvider {...form}>
              <form id="new-match" onSubmit={form.handleSubmit(onSubmit)}>
                {isLoading ? (
                  <Center py={16}>
                    <LoadingIcon color="grey.6" size={16} />
                  </Center>
                ) : isOpen ? (
                  <Stack spacing={8}>
                    <Teams gameId={gameId} maxPlayersPerTeam={maxPlayersPerTeam || 1} />
                    <Scores />
                  </Stack>
                ) : null}
              </form>
            </FormProvider>
          </ModalBody>

          <ModalFooter pb={6} flexDir="column">
            <Button variant="primary" flexGrow="1" type="submit" form="new-match" w="100%" size="lg">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewMatchButton;

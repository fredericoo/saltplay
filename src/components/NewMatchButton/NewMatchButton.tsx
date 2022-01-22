import { MatchesPOSTAPIResponse } from '@/pages/api/matches';
import {
  Button,
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
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
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

const NewMatchButton: React.VFC<NewMatchButtonProps> = ({ gameId, onSubmitSuccess, maxPlayersPerTeam }) => {
  const { status } = useSession();
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
    const matchToAdd = {
      leftids: data.left.map(({ id }) => id),
      leftscore: data.leftscore,
      rightids: data.right.map(({ id }) => id),
      rightscore: data.rightscore,
      gameid: gameId,
    };
    try {
      const res: MatchesPOSTAPIResponse = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchToAdd),
      }).then(res => res.json());

      if (res.status !== 'ok') throw new Error('Error creating match');
      toast({
        render: () => <Toast status="success" heading="Match added" />,
        position: 'bottom',
      });
      form.reset();
      onSubmitSuccess && onSubmitSuccess();
    } catch {
      toast({
        render: () => <Toast status="error" heading="Error adding match" />,
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
      <Button w="100%" variant="primary" onClick={onOpen} leftIcon={<span>+</span>}>
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

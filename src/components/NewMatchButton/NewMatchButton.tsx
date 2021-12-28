import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Center,
} from '@chakra-ui/react';
import { Game, Match } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import NewMatchForm from './NewMatchForm';
import { useToast } from '@chakra-ui/react';
import LoadingIcon from '../LoadingIcon';
import { MatchesPOSTAPIResponse } from '@/pages/api/matches';

type NewMatchButtonProps = {
  gameId: Game['id'];
  onSubmitSuccess?: () => void;
};

export type MatchFormInputs = Pick<Match, 'p2id' | 'p1score' | 'p2score'>;

const NewMatchButton: React.VFC<NewMatchButtonProps> = ({ gameId, onSubmitSuccess }) => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const form = useForm<MatchFormInputs>();
  const toast = useToast();
  if (!isLoggedIn) return null;

  const onSubmit = async (data: MatchFormInputs) => {
    setIsLoading(true);
    const matchToAdd = {
      ...data,
      p1id: session?.user.id,
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
        status: 'success',
        position: 'bottom',
        title: 'Match added',
      });
      form.reset();
      onSubmitSuccess && onSubmitSuccess();
    } catch {
      toast({
        status: 'error',
        position: 'bottom',
        title: 'Error adding match',
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
                  <NewMatchForm gameId={gameId} />
                )}
              </form>
            </FormProvider>
          </ModalBody>

          <ModalFooter>
            <Button variant="primary" type="submit" form="new-match" mr={3}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewMatchButton;

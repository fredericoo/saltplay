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

type NewMatchButtonProps = {
  gameId: Game['id'];
};

export type MatchFormInputs = Pick<Match, 'p2id' | 'p1score' | 'p2score'>;

const NewMatchButton: React.VFC<NewMatchButtonProps> = ({ gameId }) => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const form = useForm<MatchFormInputs>();
  const toast = useToast();

  const onSubmit = async (data: MatchFormInputs) => {
    setIsLoading(true);
    try {
      await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          p1id: session?.user.id,
          gameid: gameId,
        }),
      });
      toast({
        status: 'success',
        position: 'bottom',
        title: 'Match added',
      });
    } catch {
      toast({
        status: 'error',
        position: 'bottom',
        title: 'Error adding match',
      });
    }
    setIsLoading(false);
    onClose();
  };

  return (
    <>
      <Button w="100%" isDisabled={!isLoggedIn} onClick={onOpen} leftIcon={<span>🆚</span>}>
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
            <Button type="submit" form="new-match" mr={3}>
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

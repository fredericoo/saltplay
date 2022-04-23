import {
  Button,
  ButtonProps,
  ComponentWithAs,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { SyntheticEvent, useState } from 'react';

type DeleteButtonProps = {
  onDelete: () => void;
  isLoading?: boolean;
  keyword?: string;
};

const DeleteButton: ComponentWithAs<'button', ButtonProps & DeleteButtonProps> = ({
  onDelete,
  children,
  keyword = 'DELETE',
  isLoading,
  ...props
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState('');

  const handleSubmit = (event: SyntheticEvent<HTMLInputElement>) => {
    event.preventDefault();
    onDelete();
    onClose();
  };

  const handleClose = () => {
    setInput('');
    onClose();
  };

  return (
    <>
      <Button variant="solid" colorScheme="danger" onClick={onOpen} {...props}>
        {children}
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody py={6}>
            <VStack align="flex-start" spacing={4} as="form" onSubmit={handleSubmit}>
              <Heading as="h2" size="sm" color="grey.12">
                Irreversible action
              </Heading>
              <Text color="grey.11">
                To delete, please type in{' '}
                <Text as="span" fontWeight="bold" bg="grey.4" px={1.5} py={1} borderRadius="md">
                  {keyword}
                </Text>{' '}
                in the box below.
              </Text>
              <Input isDisabled={isLoading} type="text" onChange={e => setInput(e.target.value)} value={input} />
              <HStack spacing={2} justify="flex-end" w="100%">
                <Button
                  type="submit"
                  variant="solid"
                  colorScheme="danger"
                  isLoading={isLoading}
                  isDisabled={keyword !== input}
                >
                  Delete
                </Button>
                <Button onClick={handleClose} variant="ghost" isDisabled={isLoading}>
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteButton;

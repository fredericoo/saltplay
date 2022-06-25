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

export type ConfirmButtonProps = {
  onConfirm: () => void;
  isLoading?: boolean;
  keyword?: string;
};

export const DEFAULT_KEYWORD = 'confirm';

const ConfirmButton: ComponentWithAs<'button', ButtonProps & ConfirmButtonProps> = ({
  onConfirm,
  children,
  keyword = DEFAULT_KEYWORD,
  isLoading,
  ...props
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState('');

  const handleSubmit = (event: SyntheticEvent<HTMLInputElement>) => {
    event.preventDefault();
    onConfirm();
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
                To confirm, please type{' '}
                <Text as="span" fontWeight="bold" bg="grey.4" px={1.5} py={1} borderRadius="md">
                  {keyword.toUpperCase()}
                </Text>{' '}
                :
              </Text>
              <Input
                isDisabled={isLoading}
                type="text"
                onChange={e => setInput(e.target.value.toUpperCase())}
                value={input}
              />
              <HStack spacing={2} justify="flex-end" w="100%">
                <Button
                  type="submit"
                  variant="solid"
                  colorScheme="danger"
                  isLoading={isLoading}
                  isDisabled={keyword.toUpperCase() !== input.toUpperCase()}
                >
                  Confirm
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

export default ConfirmButton;

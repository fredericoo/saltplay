import {
  Button,
  ButtonProps,
  ComponentWithAs,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  useDisclosure,
} from '@chakra-ui/react';
import { useId } from 'react-id-generator';

export type ModalFormProps = {
  closeModal: () => void;
  formId: string;
};

type ModalButton = ComponentWithAs<
  'button',
  ButtonProps & { modalProps?: Omit<ModalProps, 'isOpen' | 'onClose' | 'children'> } & {
    modalTitle?: string;
    Form: React.VFC<ModalFormProps>;
  }
>;

const ModalButton: ModalButton = ({ modalProps, modalTitle, Form, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [htmlId] = useId();

  return (
    <>
      <Button onClick={onOpen} {...props} />
      <Modal isOpen={isOpen} onClose={onClose} size="xl" {...modalProps}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form closeModal={onClose} formId={htmlId} />
          </ModalBody>

          <ModalFooter>
            <Button variant="subtle" colorScheme="success" type="submit" form={htmlId} mr={3}>
              Submit
            </Button>
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalButton;

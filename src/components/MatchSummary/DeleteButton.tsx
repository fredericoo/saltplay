import {
  Button,
  CloseButton,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Portal,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Match } from '@prisma/client';
import axios from 'axios';

type DeleteMatchButtonProps = {
  id: Match['id'];
  onDeleteStart?: () => void;
  onDeleteSuccess?: () => void;
  onDeleteError?: () => void;
};

const DeleteMatchButton: React.VFC<DeleteMatchButtonProps> = ({
  id,
  onDeleteStart,
  onDeleteSuccess,
  onDeleteError,
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleClick = async () => {
    onDeleteStart?.();
    try {
      await axios.delete(`/api/matches/${id}`);
    } catch {
      onDeleteError?.();
    }
    onDeleteSuccess?.();
  };

  return (
    <Popover isOpen={isOpen}>
      <PopoverTrigger>
        <CloseButton
          aria-label="Erase match"
          position="absolute"
          size="sm"
          right="0"
          top="0"
          transform="translate(25%, -25%)"
          bg="gray.300"
          _hover={{ bg: '#FBB826' }}
          borderRadius="full"
          onClick={onToggle}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent mx={4} zIndex="popover">
          <PopoverArrow />
          <PopoverBody>
            <Text fontWeight="bold">Are you sure?</Text>
            <Text>Deleting the match will revert the points moved.</Text>
          </PopoverBody>
          <HStack as={PopoverFooter}>
            <Button
              colorScheme="red"
              onClick={() => {
                handleClick();
                onClose();
              }}
            >
              Delete
            </Button>
            <Button variant="subtle" top={0} left={0} onClick={onClose}>
              Cancel
            </Button>
          </HStack>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default DeleteMatchButton;

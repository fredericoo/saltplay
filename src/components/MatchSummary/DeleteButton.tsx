import type {
  ChakraProps} from '@chakra-ui/react';
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
  useToast,
} from '@chakra-ui/react';
import type { Match, Season } from '@prisma/client';
import axios from 'axios';
import Toast from '../Toast';

type DeleteMatchButtonProps = {
  id: Match['id'];
  seasonId: Season['id'];
  onDeleteStart?: () => void;
  onDeleteSuccess?: () => void;
  onDeleteError?: () => void;
} & ChakraProps;

const DeleteMatchButton: React.VFC<DeleteMatchButtonProps> = ({
  id,
  seasonId,
  onDeleteStart,
  onDeleteSuccess,
  onDeleteError,
  ...props
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const toast = useToast();

  const handleClick = async () => {
    onDeleteStart?.();
    try {
      await axios.delete(`/api/matches?matchId=${id}&seasonId=${seasonId}`);
      toast({
        render: () => <Toast status="success" heading={'It’s gone'} content="Match deleted successfully." />,
        position: 'bottom',
      });
      onDeleteSuccess?.();
    } catch {
      toast({
        render: () => <Toast status="error" heading={'Oh no!'} content="Could not delete match." />,
        position: 'bottom',
      });
      onDeleteError?.();
    }
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
          bg="grey.6"
          _hover={{ bg: 'danger.9', color: 'grey.1' }}
          borderRadius="full"
          onClick={onToggle}
          {...props}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent mx={4} zIndex="popover">
          <PopoverArrow />
          <PopoverBody>
            <Text fontWeight="bold">Are you sure?</Text>
            <Text color="grey.10">Deleting the match will revert the points moved.</Text>
          </PopoverBody>
          <HStack as={PopoverFooter} p={0} spacing={0}>
            <Button
              borderRadius={0}
              borderBottomLeftRadius="lg"
              flex={1}
              variant="solid"
              colorScheme="danger"
              onClick={() => {
                handleClick();
                onClose();
              }}
            >
              Delete
            </Button>
            <Button
              borderRadius={0}
              borderBottomRightRadius="lg"
              flex={1}
              variant="subtle"
              colorScheme="grey"
              top={0}
              left={0}
              onClick={onClose}
            >
              Cancel
            </Button>
          </HStack>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default DeleteMatchButton;

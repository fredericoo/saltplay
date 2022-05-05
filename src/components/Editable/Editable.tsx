import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { FormEventHandler, useEffect, useRef } from 'react';
import FocusLock from 'react-focus-lock';
import { IoCheckmarkOutline, IoCloseOutline } from 'react-icons/io5';
import { VscAdd, VscEdit } from 'react-icons/vsc';

export type EditableProps<TID extends PropertyKey> = {
  id: TID;
  isEditing?: boolean;
  isDisabled?: boolean;
  value?: JSX.Element | string | number | null;
  error?: string;
  preText?: string;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: (props: { id: TID; value: string | number }) => void;
  children?: JSX.Element | null;
};

const Editable = <T extends PropertyKey>({
  id,
  children,
  isEditing,
  value,
  onEdit,
  onCancel,
  onSave,
  isDisabled,
  error,
  preText,
}: EditableProps<T>) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isEditing && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isEditing]);

  if (!isEditing)
    return (
      <HStack flexShrink={1} justifyContent="flex-end" overflow="hidden">
        {value && (
          <Box
            tabIndex={-1}
            as="button"
            textAlign="right"
            onClick={isDisabled ? undefined : onEdit}
            color="grey.11"
            _hover={isDisabled ? undefined : { bg: 'grey.2', borderColor: 'grey.5' }}
            px={3}
            py={2}
            borderRadius="md"
            border="1px solid transparent"
            cursor="text"
            opacity={isDisabled ? 0.5 : 1}
            isTruncated
          >
            <Text as="span" color="grey.8" isTruncated>
              {preText}
            </Text>
            {value}
          </Box>
        )}
        <IconButton
          ref={buttonRef}
          key="edit"
          variant="solid"
          type="button"
          p={2}
          colorScheme="grey"
          onClick={onEdit}
          isDisabled={isDisabled}
          css={{ aspectRatio: '1' }}
          aria-label={`Edit field "${id}"`}
        >
          {value ? <VscEdit /> : <VscAdd />}
        </IconButton>
      </HStack>
    );

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const value = formData.get(id.toString());
    !!value && onSave?.({ id, value: typeof value === 'string' ? value : '' });
  };

  return (
    <Box as={FocusLock} overflow="hidden">
      <Tooltip variant="error" label={error} placement="bottom-end" isOpen={!!error} offset={[-8, -8]}>
        <HStack as="form" flexShrink={1} flexGrow={1} onSubmit={handleSubmit}>
          <Box flexGrow={1} flexShrink={1} overflow="hidden">
            {children}
          </Box>
          <HStack spacing={1} flexShrink={0}>
            <IconButton
              aria-label="submit"
              variant="solid"
              key="submit"
              type="submit"
              p={2}
              colorScheme="success"
              isDisabled={isDisabled}
              css={{ aspectRatio: '1' }}
            >
              <IoCheckmarkOutline />
            </IconButton>
            <IconButton
              aria-label="cancel"
              variant="solid"
              key="cancel"
              type="button"
              p={2}
              colorScheme="danger"
              onClick={onCancel}
              isDisabled={isDisabled}
              css={{ aspectRatio: '1' }}
            >
              <IoCloseOutline />
            </IconButton>
          </HStack>
        </HStack>
      </Tooltip>
    </Box>
  );
};

export default Editable;

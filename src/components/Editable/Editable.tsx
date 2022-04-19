import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { FormEventHandler } from 'react';
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
  if (!isEditing)
    return (
      <HStack flexShrink={1} flexGrow={1} justifyContent="flex-end" overflow="hidden">
        {value && (
          <Box
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
            <Text as="span" color="grey.8">
              {preText}
            </Text>
            {value}
          </Box>
        )}
        <IconButton
          aria-label="edit"
          key="edit"
          variant="solid"
          type="button"
          p={2}
          colorScheme="grey"
          onClick={onEdit}
          isDisabled={isDisabled}
          css={{ aspectRatio: '1' }}
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
    <Tooltip label={error} placement="bottom-start" isOpen={!!error}>
      <HStack as="form" flexShrink={1} flexGrow={1} onSubmit={handleSubmit}>
        {children}
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
    </Tooltip>
  );
};

export default Editable;

import type { ChakraProps } from '@chakra-ui/react';
import {
  Center,
  HStack,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import type { IEmojiPickerProps } from 'emoji-picker-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import LoadingIcon from '../../shared/LoadingIcon';

const EmojiPicker = dynamic<IEmojiPickerProps>(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => (
    <Center minH="300px">
      <LoadingIcon color="grey.200" size={16} />
    </Center>
  ),
});

type EmojiFieldProps = ChakraProps & {
  defaultValue?: string;
  autoFocus?: boolean;
  align: 'left' | 'right';
  name: string;
  label?: string;
};

const EmojiField: React.FC<EmojiFieldProps> = ({ defaultValue, name, autoFocus, align, label, ...props }) => {
  const [value, setValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(autoFocus === true);

  const darkModeAdjust = useColorModeValue(undefined, 'invert(100%)');
  return (
    <HStack justify={align === 'right' ? 'flex-end' : 'flex-start'} flexGrow="1">
      {label && (
        <Text px={2} color="grey.9" as="label" htmlFor={name}>
          {label}
        </Text>
      )}
      <Popover
        isOpen={isOpen}
        returnFocusOnClose={false}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        placement={align === 'right' ? 'bottom-end' : 'bottom-start'}
      >
        <PopoverTrigger>
          <Input
            {...props}
            textAlign="center"
            fontSize="xl"
            w="2em"
            px={0}
            type="text"
            autoComplete="off"
            value={value}
            name={name}
            borderColor={isOpen ? 'grey.10' : undefined}
            onChange={e => setValue(e.target.value)}
          />
        </PopoverTrigger>
        <PopoverContent
          sx={{
            '.emoji-picker-react input.emoji-search': { bg: 'grey.1', border: 'none !important' },
            '.emoji-picker-react .emoji-group:before': { bg: 'grey.2', fontSize: 'xs', h: '3em' },
            '.emoji-picker-react .active-category-indicator-wrapper .active-category-indicator': {
              bg: 'primary.9',
            },
            '.emoji-picker-react .emoji-categories': {
              filter: darkModeAdjust,
              bg: 'transparent',
            },
          }}
          zIndex="overlay"
        >
          <EmojiPicker
            disableSkinTonePicker
            pickerStyle={{
              boxShadow: 'none',
              width: '100%',
              borderRadius: 'var(--wrkplay-radii-lg)',
              backgroundColor: 'var(--wrkplay-colors-grey-2)',
              border: 'none',
              color: 'var(--wrkplay-colors-grey-12)',
            }}
            onEmojiClick={(_, square) => {
              setValue(square.emoji);
              setIsOpen(false);
            }}
            groupNames={{ smileys_people: 'PEOPLE' }}
            native
          />
        </PopoverContent>
      </Popover>
    </HStack>
  );
};

export default EmojiField;

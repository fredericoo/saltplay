import {
  ChakraProps,
  HStack,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
} from '@chakra-ui/react';
import { IEmojiPickerProps } from 'emoji-picker-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const EmojiPicker = dynamic<IEmojiPickerProps>(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

type EditableEmojiProps = ChakraProps & {
  defaultValue?: string;
  name: string;
};

const EditableEmoji: React.VFC<EditableEmojiProps> = ({ defaultValue, name, ...props }) => {
  const [value, setValue] = useState(defaultValue);
  const darkModeAdjust = useColorModeValue(undefined, 'invert(100%)');
  return (
    <Popover isOpen placement="bottom-end">
      <PopoverTrigger>
        <HStack justify="end" {...props} flexGrow="1">
          <Input
            textAlign="center"
            fontSize="xl"
            w="2em"
            px={0}
            type="text"
            autoComplete="off"
            value={value}
            name={name}
          />
        </HStack>
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
          onEmojiClick={(_, emoji) => setValue(emoji.emoji)}
          groupNames={{ smileys_people: 'PEOPLE' }}
          native
        />
      </PopoverContent>
    </Popover>
  );
};

export default EditableEmoji;

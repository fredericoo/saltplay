import { HStack, Input, InputProps, Text } from '@chakra-ui/react';
import { useState } from 'react';

type EditableInputProps = Omit<InputProps, 'onChange' | 'value' | 'defaultValue' | 'prefix'> & {
  defaultValue?: string;
  prefix?: string;
  suffix?: string;
  format?: (value: string) => string;
};
const EditableInput: React.VFC<EditableInputProps> = ({
  format,
  defaultValue,
  prefix,
  suffix,
  textAlign,
  ...props
}) => {
  const [value, setValue] = useState<string>(defaultValue || '');
  return (
    <HStack spacing={0}>
      {prefix && (
        <Text pl={'.625rem'} as="span" userSelect={'none'} color="grey.10">
          {prefix}
        </Text>
      )}
      <Input
        fontSize="sm"
        type="text"
        autoComplete="off"
        value={value}
        pl={prefix ? '1' : undefined}
        pr={suffix ? '1' : undefined}
        textAlign={!prefix ? textAlign : 'left'}
        {...props}
        variant="transparent"
        onChange={e => setValue(format ? format(e.target.value) : e.target.value)}
      />
      {suffix && <span>{suffix}</span>}
    </HStack>
  );
};

export default EditableInput;

import { Input, InputProps } from '@chakra-ui/react';
import { useState } from 'react';

type EditableInputProps = Omit<InputProps, 'onChange' | 'value' | 'isInvalid' | 'defaultValue'> & {
  defaultValue?: string;
  validate?: (value: string) => boolean;
  format?: (value: string) => string;
};
const EditableInput: React.VFC<EditableInputProps> = ({ validate, format, defaultValue, ...props }) => {
  const [value, setValue] = useState<string>(defaultValue || '');
  const isInvalid = !!validate && !validate(value);
  return (
    <Input
      fontSize="sm"
      type="text"
      autoComplete="off"
      value={value}
      {...props}
      isInvalid={isInvalid}
      onChange={e => setValue(format ? format(e.target.value) : e.target.value)}
    />
  );
};

export default EditableInput;

import type { ChakraProps} from '@chakra-ui/react';
import { HStack, Input, Switch, Text } from '@chakra-ui/react';
import { useState } from 'react';

type SwitchFieldProps = ChakraProps & {
  defaultValue?: boolean;
  autoFocus?: boolean;
  name: string;
  label?: string;
};

const SwitchField: React.VFC<SwitchFieldProps> = ({ defaultValue, name, autoFocus, label, ...props }) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <HStack flexGrow="1">
      {label && (
        <Text px={2} color="grey.9" as="label" htmlFor={name}>
          {label}
        </Text>
      )}
      <Input type="hidden" value={value === true ? 'true' : 'false'} name={name} />
      <Switch
        size="lg"
        required={false}
        autoFocus={autoFocus}
        isChecked={value === true}
        defaultChecked={defaultValue}
        aria-label={label}
        onChange={() => setValue(value => !value)}
        {...props}
      />
    </HStack>
  );
};

export default SwitchField;

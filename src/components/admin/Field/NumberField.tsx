import { HStack, IconButton, Input, Text } from '@chakra-ui/react';
import { clamp } from 'ramda';
import type { Reducer } from 'react';
import { useReducer } from 'react';
import { VscChevronDown, VscChevronUp } from 'react-icons/vsc';

type NumberFieldProps = {
  min?: number;
  max?: number;
  defaultValue?: number;
  name: string;
  label?: string;
};

const createReducer = ({ min, max }: { min?: number; max?: number }) => {
  const reducer: Reducer<number | undefined, { type: 'increment' | 'decrement' | 'set'; value: number }> = (
    state,
    action
  ) => {
    switch (action.type) {
      case 'increment':
        return clamp(min, max, (state || 0) + action.value);
      case 'decrement':
        return clamp(min, max, (state || 0) - action.value);
      case 'set':
        return clamp(min, max, action.value);
      default:
        throw new Error();
    }
  };
  return reducer;
};

const NumberField: React.FC<NumberFieldProps> = ({ defaultValue, min, max, name, label }) => {
  const [value, dispatch] = useReducer(createReducer({ min, max }), defaultValue || min || 0);

  return (
    <HStack spacing={4} overflow="hidden" flexShrink={1}>
      {label && (
        <Text color="grey.9" as="label" htmlFor={name}>
          {label}
        </Text>
      )}
      <HStack spacing={0}>
        <IconButton
          variant="solid"
          borderRightRadius={0}
          onClick={() => dispatch({ type: 'decrement', value: 1 })}
          aria-label="Subtract 1"
          css={{ aspectRatio: '1' }}
        >
          <VscChevronDown />
        </IconButton>
        <Input
          borderRadius={0}
          flexShrink={0}
          type="number"
          value={value}
          name={name}
          onClick={e => e.currentTarget.select()}
          onChange={e => dispatch({ type: 'set', value: +e.target.value })}
          maxW="8ch"
          textAlign={'center'}
        />
        <IconButton
          variant="solid"
          borderLeftRadius={0}
          onClick={() => dispatch({ type: 'increment', value: 1 })}
          aria-label="Add 1"
          css={{ aspectRatio: '1' }}
        >
          <VscChevronUp />
        </IconButton>
      </HStack>
    </HStack>
  );
};

export default NumberField;

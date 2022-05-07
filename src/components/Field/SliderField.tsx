import { Box, HStack, Input, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from '@chakra-ui/react';
import { useState } from 'react';

type SliderFieldProps = {
  min?: number;
  max?: number;
  defaultValue?: number;
  name: string;
  label?: string;
};

const SliderField: React.VFC<SliderFieldProps> = ({ defaultValue, min, max, name, label }) => {
  const [value, setValue] = useState(defaultValue || 0);
  return (
    <HStack spacing={4} overflow="hdiden" flexShrink={1}>
      {label && (
        <Text color="grey.9" as="label" htmlFor={name}>
          {label}
        </Text>
      )}
      <Box flexGrow={1} flexShrink={1} px={4}>
        <Slider value={value} min={min} max={max} name={name} step={1} onChange={setValue} minW="200px">
          <SliderTrack bg="grey.7">
            <SliderFilledTrack bg="primary.9" />
          </SliderTrack>
          <SliderThumb boxSize={4} />
        </Slider>
      </Box>
      <Input
        flexShrink={0}
        type="number"
        value={value}
        onClick={e => e.currentTarget.select()}
        onChange={e => setValue(+e.target.value)}
        maxW="4ch"
        textAlign={'center'}
      />
    </HStack>
  );
};

export default SliderField;

import { Box, HStack, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Text } from '@chakra-ui/react';
import { useState } from 'react';

type EditableSliderProps = {
  min?: number;
  max?: number;
  defaultValue?: number;
  name: string;
  label?: string;
};

const EditableSlider: React.VFC<EditableSliderProps> = ({ defaultValue, min, max, name, label }) => {
  const [value, setValue] = useState(defaultValue || 0);
  return (
    <HStack>
      {label && (
        <Text px={2} color="grey.9" as="label" htmlFor={name}>
          {label}
        </Text>
      )}
      <Box px={4} flexGrow={1}>
        <Slider defaultValue={value} min={min} max={max} name={name} step={1} onChange={setValue} minW="200px">
          {new Array(Math.abs((max || 0) - (min || 0)) + 1).fill(0).map((_, i) => (
            <SliderMark
              key={i}
              color={value === i + 1 ? 'grey.12' : 'grey.10'}
              value={(min || 0) + i}
              mt="2"
              ml={`-${`${i}`.length * 0.5}ch`}
              fontSize="sm"
            >
              {(min || 0) + i}
            </SliderMark>
          ))}
          <SliderTrack bg="grey.7">
            <SliderFilledTrack bg="primary.9" />
          </SliderTrack>
          <SliderThumb boxSize={4} />
        </Slider>
      </Box>
    </HStack>
  );
};

export default EditableSlider;

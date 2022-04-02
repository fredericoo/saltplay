import { Input, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack } from '@chakra-ui/react';
import { useState } from 'react';

type EditableSliderProps = {
  min?: number;
  max?: number;
  defaultValue?: number;
  name: string;
};

const EditableSlider: React.VFC<EditableSliderProps> = ({ defaultValue, min, max, name }) => {
  const [value, setValue] = useState(defaultValue || 0);
  return (
    <Slider defaultValue={value} min={min} max={max} step={1} onChange={setValue} mx={4}>
      <Input type="hidden" value={value} name={name} />
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
        <SliderFilledTrack bg="success.9" />
      </SliderTrack>
      <SliderThumb boxSize={4} />
    </Slider>
  );
};

export default EditableSlider;

import { getFlagTogglesFromNumber } from '@/lib/flagAttributes';
import { Switch } from '@chakra-ui/react';
import { useState } from 'react';
import Settings from '../Settings';

type FlagsSwitchProps = {
  flags: Record<string, number>;
  defaultValue?: number;
  label?: string;
  isDisabled?: boolean;
  onChange?: (flags: number) => Promise<void>;
};

const FlagsSwitch: React.VFC<FlagsSwitchProps> = ({ flags, label, defaultValue, onChange, isDisabled }) => {
  const [value, setValue] = useState(defaultValue ?? 0);
  const [isLoading, setIsLoading] = useState(false);
  const toggles = Object.entries(getFlagTogglesFromNumber(flags, value));

  const handleChange = async (flagIndex: number) => {
    const newValue = value ^ (1 << flagIndex);
    setValue(newValue);
    if (onChange) {
      setIsLoading(true);
      await onChange(newValue);
      setIsLoading(false);
    }
  };

  return (
    <Settings.List label={label}>
      {toggles.map(([name, isActive], i) => (
        <Settings.Item key={name} label={name}>
          <Switch
            size="lg"
            isChecked={isActive}
            onChange={() => handleChange(i)}
            isDisabled={isDisabled || isLoading}
          />
        </Settings.Item>
      ))}
    </Settings.List>
  );
};

export default FlagsSwitch;

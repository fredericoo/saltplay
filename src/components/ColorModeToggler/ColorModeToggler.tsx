import { IconButton, IconButtonProps, useColorMode, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { MoonIcon } from './MoonIcon';
import { SunIcon } from './SunIcon';

type ThemeModeTogglerProps = Omit<IconButtonProps, 'aria-label'>;

export const ColorModeToggler: React.FC<ThemeModeTogglerProps> = props => {
  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);

  return (
    <IconButton
      aria-label="Toggle dark mode"
      variant="subtle"
      fontSize="4xl"
      bg="transparent"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      p={0}
      minWidth={0}
      {...props}
    />
  );
};

export default ColorModeToggler;

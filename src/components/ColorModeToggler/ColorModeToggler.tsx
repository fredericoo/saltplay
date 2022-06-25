import { IconButton, IconButtonProps, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { MoonIcon } from './MoonIcon';
import { SunIcon } from './SunIcon';

type ThemeModeTogglerProps = Omit<IconButtonProps, 'aria-label'>;

const Button = motion(IconButton);

export const ColorModeToggler: React.FC<ThemeModeTogglerProps> = props => {
  const { toggleColorMode, colorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);

  return (
    <AnimatePresence initial={false}>
      <Button
        role="switch"
        aria-checked={colorMode === 'dark'}
        aria-label="Dark mode"
        variant="subtle"
        fontSize="xl"
        bg="transparent"
        onClick={toggleColorMode}
        initial="initial"
        animate="animate"
        whileTap="whileTap"
        icon={<SwitchIcon />}
        p={2}
        minWidth={0}
        {...props}
      />
    </AnimatePresence>
  );
};

export default ColorModeToggler;

import type { FCC } from '@/types';
import type { IconButtonProps } from '@chakra-ui/react';
import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { MoonIcon } from './MoonIcon';
import { SunIcon } from './SunIcon';

type ThemeModeTogglerProps = Omit<IconButtonProps, 'aria-label'>;

const Button = motion(IconButton);

export const ColorModeToggler: FCC<ThemeModeTogglerProps> = props => {
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

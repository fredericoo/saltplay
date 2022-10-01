import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import type { ButtonProps } from '@chakra-ui/react';
import { Box, IconButton, Portal, Tooltip, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import type { MouseEventHandler } from 'react';

type AdminMenuProps = {
  buttons: {
    colorScheme: ButtonProps['colorScheme'];
    icon: React.ReactElement;
    label: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    href?: string;
    isHidden?: boolean;
    isLoading?: boolean;
  }[];
};

const FloatingActionButton: React.FC<AdminMenuProps> = ({ buttons }) => {
  return (
    <Portal>
      <VStack
        position="fixed"
        top={`calc(env(safe-area-inset-top) + 8px + ${NAVBAR_HEIGHT})`}
        right={4}
        zIndex="docked"
      >
        {buttons
          .filter(button => button.isHidden !== true)
          .map(button => {
            return (
              <Tooltip key={button.label + button.href + button.colorScheme} label={button.label} placement="left">
                <Box>
                  {button.onClick ? (
                    <IconButton
                      onClick={button.onClick}
                      colorScheme={button.colorScheme}
                      aria-label={button.label}
                      icon={button.icon}
                      css={{ aspectRatio: '1' }}
                      isLoading={button.isLoading}
                    />
                  ) : button.href ? (
                    <Link href={button.href} passHref>
                      <IconButton
                        colorScheme={button.colorScheme}
                        as="a"
                        aria-label={button.label}
                        icon={button.icon}
                        css={{ aspectRatio: '1' }}
                        isLoading={button.isLoading}
                      />
                    </Link>
                  ) : (
                    <IconButton
                      isDisabled
                      colorScheme={button.colorScheme}
                      aria-label={button.label}
                      icon={button.icon}
                      css={{ aspectRatio: '1' }}
                      isLoading={button.isLoading}
                    />
                  )}
                </Box>
              </Tooltip>
            );
          })}
      </VStack>
    </Portal>
  );
};

export default FloatingActionButton;

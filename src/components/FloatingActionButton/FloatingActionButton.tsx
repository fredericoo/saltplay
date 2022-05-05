import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import { ButtonProps, IconButton, Portal, Tooltip, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { MouseEventHandler } from 'react';

type AdminMenuProps = {
  buttons: {
    colorScheme: ButtonProps['colorScheme'];
    icon: React.ReactElement;
    label: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    href?: string;
  }[];
};

const FloatingActionButton: React.VFC<AdminMenuProps> = ({ buttons }) => {
  return (
    <Portal>
      <VStack
        position="fixed"
        top={`calc(env(safe-area-inset-top) + 8px + ${NAVBAR_HEIGHT})`}
        right={4}
        zIndex="docked"
      >
        {buttons.map(button => {
          return (
            <Tooltip key={button.label + button.href + button.colorScheme} label={button.label}>
              {button.onClick ? (
                <IconButton
                  onClick={button.onClick}
                  colorScheme={button.colorScheme}
                  aria-label={button.label}
                  icon={button.icon}
                  css={{ aspectRatio: '1' }}
                />
              ) : button.href ? (
                <Link href={button.href} passHref>
                  <IconButton
                    colorScheme={button.colorScheme}
                    as="a"
                    aria-label={button.label}
                    icon={button.icon}
                    css={{ aspectRatio: '1' }}
                  />
                </Link>
              ) : (
                <IconButton
                  isDisabled
                  colorScheme={button.colorScheme}
                  aria-label={button.label}
                  icon={button.icon}
                  css={{ aspectRatio: '1' }}
                />
              )}
            </Tooltip>
          );
        })}
      </VStack>
    </Portal>
  );
};

export default FloatingActionButton;

import { Box, ChakraProps, FormControl, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { VscChevronRight } from 'react-icons/vsc';

const Item: React.FC<{ label?: ReactNode; htmlFor?: string }> = ({ children, label, htmlFor }) => {
  return (
    <FormControl
      fontSize="sm"
      as="li"
      display="flex"
      py={2}
      px={4}
      alignItems="center"
      minH="4rem"
      justifyContent="space-between"
      bg="grey.3"
    >
      {label && (
        <Text as="label" color="grey.12" htmlFor={htmlFor} pr={4} flex={1} flexGrow={1} isTruncated>
          {label}
        </Text>
      )}
      {children}
    </FormControl>
  );
};

type ActionProps = { href: string; icon?: JSX.Element | string; helper?: string; showChevron?: boolean } & ChakraProps;
const Action: React.FC<ActionProps> = ({ children, href, icon, helper, showChevron = true, ...props }) => {
  return (
    <Link href={href} passHref>
      <HStack
        fontSize="md"
        as="a"
        display="flex"
        py={2}
        px={4}
        minH="4rem"
        justifyContent="space-between"
        spacing={4}
        bg="grey.3"
        _hover={{ bg: 'grey.4' }}
        _active={{ bg: 'grey.5' }}
        {...props}
      >
        <Box
          w="1.5em"
          h="1.5em"
          bg={icon ? 'grey.1' : undefined}
          borderRadius="lg"
          lineHeight={'1.5em'}
          textAlign="center"
        >
          {icon}
        </Box>
        <Box flexGrow={1}>
          {children}
          {!!helper && (
            <Box fontSize="sm" color="grey.10">
              {helper}
            </Box>
          )}
        </Box>
        {showChevron && (
          <Box px={2}>
            <VscChevronRight />
          </Box>
        )}
      </HStack>
    </Link>
  );
};

const List: React.FC<{ label?: ReactNode } & ChakraProps> = ({ children, label, ...props }) => {
  return (
    <Box {...props}>
      {label && (
        <Heading size="sm" mb={4} pl={4}>
          {label}
        </Heading>
      )}
      <Stack
        as="ul"
        spacing={0.5}
        sx={{ '&>*:first-child': { borderTopRadius: 'xl' }, '&>*:last-child': { borderBottomRadius: 'xl' } }}
      >
        {children}
      </Stack>
    </Box>
  );
};

const Settings = { List, Item, Link: Action };
export default Settings;

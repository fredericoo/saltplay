import { Box, FormControl, Heading, Stack, Text } from '@chakra-ui/react';

const Setting: React.FC<{ label?: string; htmlFor?: string }> = ({ children, label, htmlFor }) => {
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
      <Text as="label" color="grey.12" htmlFor={htmlFor} pr={4} flexGrow={1} flexShrink={0} isTruncated>
        {label}
      </Text>
      {children}
    </FormControl>
  );
};

const SettingsList: React.FC<{ label?: string }> = ({ children, label }) => {
  return (
    <Box>
      {label && (
        <Heading size="md" mb={4} pl={4}>
          {label}
        </Heading>
      )}
      <Stack as="ul" spacing={0.5} borderRadius="xl" overflow="hidden">
        {children}
      </Stack>
    </Box>
  );
};

const Settings = { List: SettingsList, Item: Setting };
export default Settings;

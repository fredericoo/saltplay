import { Box, Button, Text } from '@chakra-ui/react';

type ErrorBoxProps = {
  heading: string;
  isLoading?: boolean;
  onRetry?: () => void;
};
const ErrorBox: React.FC<ErrorBoxProps> = ({ isLoading, onRetry, heading }) => {
  return (
    <Box p={4} textAlign="center" bg="red.100" borderRadius="xl" color="red.600">
      <Text mb={2}>{heading}</Text>
      {onRetry && (
        <Button isLoading={isLoading} onClick={onRetry}>
          Retry
        </Button>
      )}
    </Box>
  );
};

export default ErrorBox;

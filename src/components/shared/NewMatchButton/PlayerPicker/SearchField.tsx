import type { ChakraProps} from '@chakra-ui/react';
import { Box, HStack, Input } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { IoCloseCircleOutline, IoSearchCircle } from 'react-icons/io5';

const MotionBox = motion(Box);

type SearchFieldProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  focusOnMount: boolean;
};

const SearchField: React.VFC<SearchFieldProps & ChakraProps> = ({ search, setSearch, focusOnMount, ...props }) => {
  return (
    <HStack
      mx={1}
      spacing={2}
      bg="grey.1"
      zIndex={3}
      borderRadius="12"
      transition=".3s ease-out"
      boxShadow="md"
      {...props}
    >
      <Box as="label" htmlFor="search" color="grey.9">
        <IoSearchCircle size="32" />
      </Box>
      <Input
        autoFocus={focusOnMount}
        id="search"
        type="text"
        onChange={e => setSearch(e.target.value)}
        value={search}
        color="grey.12"
        _placeholder={{ color: 'grey.8' }}
        placeholder="Type to search…"
        variant="unstyled"
        flexGrow={1}
        autoComplete="off"
      />
      {search && (
        <AnimatePresence>
          <MotionBox
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            as="button"
            onClick={() => setSearch('')}
            color="grey.9"
            _hover={{ color: 'grey.11' }}
            px={1}
          >
            <IoCloseCircleOutline size="24" />
          </MotionBox>
        </AnimatePresence>
      )}
    </HStack>
  );
};

export default SearchField;

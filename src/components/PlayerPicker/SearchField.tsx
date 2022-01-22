import { Box, HStack, Input } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { IoCloseCircleOutline, IoSearchCircle } from 'react-icons/io5';

const MotionBox = motion(Box);

type SearchFieldProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

const SearchField: React.VFC<SearchFieldProps> = ({ search, setSearch }) => {
  return (
    <HStack
      mx={1}
      spacing={2}
      bg="white"
      position="absolute"
      inset="3px 3px auto"
      zIndex={3}
      borderRadius="12"
      transition=".3s ease-out"
      boxShadow="lg"
    >
      <Box as="label" htmlFor="search" color="gray.500">
        <IoSearchCircle size="32" />
      </Box>
      <Input
        id="search"
        type="text"
        onChange={e => setSearch(e.target.value)}
        value={search}
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
            color="gray.400"
            _hover={{ color: 'gray.600' }}
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

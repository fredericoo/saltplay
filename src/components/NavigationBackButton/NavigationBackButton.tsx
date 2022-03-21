import { lastHistoryState } from '@/lib/navigationHistory/state';
import { Button, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { VscChevronLeft } from 'react-icons/vsc';
import { useRecoilState } from 'recoil';

const NavigationBackButton = () => {
  const [lastHistory] = useRecoilState(lastHistoryState);

  if (!lastHistory?.href || !lastHistory.title) return null;

  return (
    <Link href={lastHistory.href} passHref>
      <Button
        size="sm"
        as="a"
        variant="subtle"
        colorScheme="grey"
        h="100%"
        leftIcon={<VscChevronLeft />}
        color="grey.12"
        bg="transparent"
        _hover={{ bg: 'grey.2' }}
        _focus={{ boxShadow: 'none' }}
      >
        <Text as="span" isTruncated>
          {lastHistory?.title}
        </Text>
      </Button>
    </Link>
  );
};

export default NavigationBackButton;

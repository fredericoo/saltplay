import type { ChakraProps} from '@chakra-ui/react';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { Fragment } from 'react';
import { IoChevronForwardSharp } from 'react-icons/io5';

type Breadcrumb = {
  label: string;
  href: string;
};

type BreadcrumbsProps = {
  levels: Breadcrumb[];
} & ChakraProps;

const Level: React.FC<Breadcrumb & { isCurrent?: boolean }> = ({ label, href, isCurrent }) => {
  return (
    <Box as="li" data-testid="breadcrumb" aria-current={isCurrent ? 'page' : undefined}>
      <Link href={href} passHref={!isCurrent}>
        <Button
          as={isCurrent ? 'span' : 'a'}
          variant={isCurrent ? 'transparent' : 'subtle'}
          size="sm"
          bg="transparent"
          color="grey.12"
          maxW="20ch"
        >
          <Text as="span" noOfLines={1}>
            {label}
          </Text>
        </Button>
      </Link>
    </Box>
  );
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ levels, ...chakraProps }) => (
  <Box as="nav" aria-label="Breadcrumb" {...chakraProps}>
    <HStack as="ol" listStyleType="none" color="grey.10" spacing={0}>
      {levels.map((level, i) => {
        const isLast = i === levels.length - 1;
        return (
          <Fragment key={i}>
            <Level {...level} isCurrent={isLast} />
            {!isLast && <IoChevronForwardSharp role="presentation" />}
          </Fragment>
        );
      })}
    </HStack>
  </Box>
);

export default Breadcrumbs;

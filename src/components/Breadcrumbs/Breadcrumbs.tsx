import { Button as ThemeButton } from '@/theme/components/Button';
import { Button, ChakraProps, HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { Fragment } from 'react';
import { IoChevronForwardSharp } from 'react-icons/io5';

type Breadcrumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  levels: Breadcrumb[];
} & ChakraProps;

const Level: React.FC<Breadcrumb> = ({ label, href }) => {
  if (href)
    return (
      <Link href={href} passHref>
        <Button as="a" variant="subtle" bg="transparent" color="grey.12" maxW="20ch">
          <Text isTruncated>{label}</Text>
        </Button>
      </Link>
    );

  return (
    <Text as="span" px={ThemeButton.sizes.md.px} py={ThemeButton.sizes.md.py} isTruncated maxW="20ch">
      {label}
    </Text>
  );
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ levels, ...chakraProps }) => (
  <HStack color="grey.10" spacing={0} {...chakraProps}>
    {levels.map((level, i) => {
      const isLast = i === levels.length - 1;
      return (
        <Fragment key={i}>
          <Level {...level} />
          {isLast ? null : <IoChevronForwardSharp />}
        </Fragment>
      );
    })}
  </HStack>
);

export default Breadcrumbs;

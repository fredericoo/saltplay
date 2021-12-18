import { Office } from '@prisma/client';
import type { GetStaticProps, NextPage } from 'next';
import prisma from '@/lib/prisma';
import { Box, Container, SimpleGrid } from '@chakra-ui/react';
import Link from 'next/link';

type HomeProps = {
  offices: Office[];
};

const Home: NextPage<HomeProps> = ({ offices }) => {
  return (
    <Box py={8}>
      <Container maxW="container.lg">
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
          {offices.map(office => (
            <Link href={`/${office.slug}`} key={office.id} passHref>
              <Box as="a" bg="gray.100" p={8} borderRadius="xl" _hover={{ bg: 'gray.200' }}>
                {office.name}
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const offices = await prisma.office.findMany();
  return {
    props: { offices: offices },
    revalidate: 60 * 60 * 24,
  };
};

export default Home;

import { Office } from '@prisma/client';
import type { GetStaticProps, NextPage } from 'next';
import prisma from '../lib/prisma';
import { Box, Container, SimpleGrid } from '@chakra-ui/react';

type HomeProps = {
  offices: Office[];
};

const Home: NextPage<HomeProps> = ({ offices }) => {
  return (
    <Box py={8}>
      <Container maxW="container.lg">
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} as="ul" listStyleType="none">
          {offices.map(office => (
            <Box key={office.id} bg="gray.100" p={8} borderRadius="xl" as="li" _hover={{ bg: 'gray.200' }}>
              <a href={`/${office.name}`}>{office.name}</a>
            </Box>
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
  };
};

export default Home;

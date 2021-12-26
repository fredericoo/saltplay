import { Office } from '@prisma/client';
import type { GetStaticProps, NextPage } from 'next';
import prisma from '@/lib/prisma';
import { Box, Container, HStack, SimpleGrid } from '@chakra-ui/react';
import Link from 'next/link';
import { PromiseElement } from '@/lib/types/utils';
import PlayerAvatar from '@/components/PlayerAvatar';
import PlayerLink from '@/components/PlayerLink/PlayerLink';

type HomeProps = {
  users: PromiseElement<ReturnType<typeof getUsers>>;
};

const getUsers = () => prisma.user.findMany({ select: { id: true, name: true, image: true } });

const Home: NextPage<HomeProps> = ({ users }) => {
  return (
    <Box py={8}>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
        {users.map(user => (
          <HStack key={user.id}>
            <PlayerAvatar name={user.name} photo={user.image} />
            <PlayerLink name={user.name} id={user.id} />
          </HStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const users = await getUsers();
  return {
    props: { users },
    revalidate: 60 * 60 * 24,
  };
};

export default Home;

import { createFetcher } from '@/lib/fetcher';
import type { DevUsersAPIResponse } from '@/pages/api/dev/users';
import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import type { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const setSession = async (userid: User['id']) => {
  await axios.post('/api/dev/sessions', { userid });
  location.reload();
};

const DevUserMenu: React.FC = () => {
  const { data: res } = useQuery(['dev-users'], createFetcher<DevUsersAPIResponse>('/api/dev/users'));

  return (
    <Menu isLazy>
      <MenuButton as={Button} variant="subtle" colorScheme="primary" textAlign="left" fontSize="xs" size="sm">
        <Text noOfLines={1} maxW="128px">
          Dev Sign in
        </Text>
      </MenuButton>
      <MenuList maxH="200px" overflow="scroll">
        {res?.data?.users.map(user => (
          <MenuItem onClick={() => setSession(user.id)} key={user.id}>
            {user.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default DevUserMenu;

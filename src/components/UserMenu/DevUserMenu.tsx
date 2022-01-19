import fetcher from '@/lib/fetcher';
import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import useSWR from 'swr';
import { User } from '@prisma/client';
import { DevUsersAPIResponse } from '@/pages/api/dev/users';
import axios from 'axios';

const setSession = async (userid: User['id']) => {
  await axios.post('/api/dev/sessions', { userid });
  location.reload();
};

const DevUserMenu: React.VFC = () => {
  const { data } = useSWR<DevUsersAPIResponse>('/api/dev/users', fetcher);
  return (
    <Menu isLazy>
      <MenuButton as={Button} variant="solid" colorScheme="blue" textAlign="left" fontSize="xs" size="sm">
        <Text isTruncated maxW="128px">
          Dev Sign in
        </Text>
      </MenuButton>
      <MenuList maxH="200px" overflow="scroll">
        {data?.users?.map(user => (
          <MenuItem onClick={() => setSession(user.id)} key={user.id}>
            {user.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default DevUserMenu;

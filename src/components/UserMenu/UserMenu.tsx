import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const UserMenu: React.VFC = () => {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  if (!isLoading && !session)
    return (
      <Link href="/api/auth/signin" passHref>
        <Button as="a" size="sm">
          Login
        </Button>
      </Link>
    );

  return (
    <Menu isLazy>
      <MenuButton as={Button} size="sm" isLoading={isLoading}>
        {session?.user?.name || session?.user?.email}
      </MenuButton>
      <MenuList>
        <Link href="/api/auth/signout" passHref>
          <MenuItem as="a">Log out</MenuItem>
        </Link>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;

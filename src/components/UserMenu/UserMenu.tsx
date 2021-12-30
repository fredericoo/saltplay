import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PlayerAvatar from '../PlayerAvatar';

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
      <MenuButton
        as={Button}
        variant="ghost"
        textAlign="left"
        fontSize="xs"
        size="sm"
        isLoading={isLoading}
        leftIcon={session?.user && <PlayerAvatar size={6} user={session?.user} />}
      >
        <Text isTruncated maxW="128px">
          {session?.user?.name || session?.user?.email}
        </Text>
      </MenuButton>
      <MenuList>
        <Link href={`/player/${session?.user.id}`} passHref>
          <MenuItem as="a">My Profile</MenuItem>
        </Link>
        <Link href="/api/auth/signout" passHref>
          <MenuItem as="a">Log out</MenuItem>
        </Link>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;

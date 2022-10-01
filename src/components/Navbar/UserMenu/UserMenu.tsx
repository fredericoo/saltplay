import { identifyAndSetUser } from '@/lib/mixpanel';
import { canViewDashboard } from '@/lib/roles';
import { Button, HStack, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { VscChevronDown } from 'react-icons/vsc';
import PlayerAvatar from '../../shared/PlayerAvatar';
import DevUserMenu from './DevUserMenu';

type UserMenuProps = {
  showUserName?: boolean;
};

const isDevLoginEnabled = process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === 'true';

const UserMenu: React.FC<UserMenuProps> = ({ showUserName }) => {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  useEffect(() => {
    session?.user && identifyAndSetUser(session.user);
  }, [session?.user]);

  if (!session || isLoading) {
    return isDevLoginEnabled ? (
      <DevUserMenu />
    ) : (
      <Button isLoading={isLoading} as="a" href="/api/auth/signin" size="sm" variant="subtle" colorScheme="grey">
        Sign in
      </Button>
    );
  }

  return (
    <Menu>
      <MenuButton
        data-testid="logged-in-user-menu"
        as={Button}
        variant="subtle"
        textAlign="left"
        bg="transparent"
        isLoading={isLoading}
        rightIcon={showUserName ? <VscChevronDown /> : undefined}
        sx={{ aspectRatio: { base: '1', md: 'initial' } }}
      >
        <HStack>
          {session?.user && <PlayerAvatar size={showUserName ? 4 : 5} user={session?.user} />}
          {showUserName && (
            <Text noOfLines={1} maxW="128px">
              {session?.user?.name?.split(' ')[0] || session?.user?.email}
            </Text>
          )}
        </HStack>
      </MenuButton>
      <MenuList>
        <Link href={`/player/${session?.user.id}`} passHref>
          <MenuItem as="a">My Profile</MenuItem>
        </Link>
        {canViewDashboard(session?.user.roleId) && (
          <Link href={`/admin`} passHref>
            <MenuItem as="a">Admin Panel</MenuItem>
          </Link>
        )}

        <MenuItem as="a" href="/api/auth/signout">
          Sign out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;

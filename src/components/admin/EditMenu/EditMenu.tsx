import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import { canViewDashboard } from '@/lib/roles';
import { IconButton, Portal, Tooltip, VStack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { VscEdit } from 'react-icons/vsc';

type EditMenuProps = {
  editHref?: string;
};

const EditMenu: React.VFC<EditMenuProps> = ({ editHref }) => {
  const { data: session } = useSession();
  if (!canViewDashboard(session?.user.roleId)) return null;

  return (
    <Portal>
      <VStack
        position="fixed"
        top={`calc(env(safe-area-inset-top) + 8px + ${NAVBAR_HEIGHT})`}
        right={4}
        zIndex="docked"
      >
        <Tooltip label="Edit">
          <IconButton
            colorScheme="primary"
            as="a"
            href={editHref}
            aria-label="edit"
            icon={<VscEdit />}
            css={{ aspectRatio: '1' }}
          />
        </Tooltip>
      </VStack>
    </Portal>
  );
};

export default EditMenu;

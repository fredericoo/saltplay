import { centraliseEmoji } from '@/lib/styleUtils';
import { Center, ChakraProps } from '@chakra-ui/react';
import { Role } from '@prisma/client';

const roleIcons: Record<Role['id'], string> = {
  0: '🔑',
  2: '👻',
};

export const RoleIcon: React.VFC<ChakraProps & { roleId: Role['id'] }> = ({ roleId, ...props }) => {
  if (!(roleId in roleIcons)) return null;

  return (
    <Center
      h="1.5em"
      w="1.5em"
      whiteSpace="nowrap"
      bg="gray.100"
      border="2px solid"
      borderColor="white"
      borderRadius="full"
      sx={centraliseEmoji}
      {...props}
    >
      <span>{roleIcons[roleId]}</span>
    </Center>
  );
};

export default RoleIcon;

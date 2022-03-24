import { centraliseEmoji } from '@/lib/styleUtils';
import { Center, ChakraProps } from '@chakra-ui/react';
import { Role } from '@prisma/client';

const roleIcons: Record<Role['id'], string> = {
  2: '👻',
};

export const RoleBadge: React.VFC<ChakraProps & { roleId: Role['id'] }> = ({ roleId, ...props }) => {
  if (!(roleId in roleIcons)) return null;

  return (
    <Center
      pointerEvents="none"
      userSelect="none"
      h="1.5em"
      w="1.5em"
      whiteSpace="nowrap"
      bg="grey.1"
      borderRadius="full"
      sx={centraliseEmoji}
      {...props}
    >
      <span>{roleIcons[roleId]}</span>
    </Center>
  );
};

export default RoleBadge;

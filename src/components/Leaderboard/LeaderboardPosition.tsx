import { Badge, Box, HStack, StackProps, styled, Text } from '@chakra-ui/react';
import { Role, User } from '@prisma/client';
import { MotionHStack } from '../Motion';
import PlayerAvatar from '../PlayerAvatar';
import PlayerName from '../PlayerName';
import PointIcon from '../PointIcon';
import PositionNumber from './PositionNumber';

export type LeaderboardPositionProps = {
  id: User['id'];
  position: number;
  roleId: Role['id'];
  name: string | null;
  photo?: string | null;
  points: number;
  wins?: number;
  losses?: number;
  hasIcons?: boolean;
  isMe?: boolean;
  bottom?: number | string;
  bg?: string;
};

const FirstPlaceFx = styled(Box, {
  baseStyle: {
    background: 'linear-gradient(-30deg, #14ffe9, #ffeb3b, #fe33a1)',
    inset: 1,
    position: 'absolute',
    borderRadius: 'xl',
    filter: 'blur(12px)',
    opacity: 1,
  },
});

const LeaderboardPosition: React.VFC<LeaderboardPositionProps & Omit<StackProps, keyof LeaderboardPositionProps>> = ({
  id,
  roleId,
  position,
  name,
  photo,
  points,
  wins,
  losses,
  hasIcons = true,
  isMe = false,
  bottom,
  bg,
  ...chakraProps
}) => {
  const isFirstPlace = position === 1;
  const meProps =
    isMe && typeof bottom !== 'undefined'
      ? {
          pos: 'sticky',
          bottom: bottom,
          zIndex: 'docked',
          _before: {
            zIndex: '-1',
            content: "''",
            position: 'absolute',
            inset: '-.5rem',
            bg,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) , rgba(0,0,0,1) 33%) ',
          },
        }
      : {};

  return (
    <MotionHStack layout {...chakraProps} {...meProps}>
      {!isFirstPlace && <PositionNumber position={position} displayMedals={hasIcons} />}

      <Box position="relative" w="100%">
        {isFirstPlace && <FirstPlaceFx />}

        <HStack
          bg="grey.1"
          p={4}
          borderRadius="xl"
          gap={4}
          position="relative"
          boxShadow={isFirstPlace ? '0 32px 64px 0 rgba(0,0,0,0.1)' : undefined}
          zIndex={isFirstPlace ? 1 : undefined}
          border="1px solid transparent"
          borderColor={isMe ? 'primary.9' : undefined}
        >
          <PlayerAvatar user={{ id, name, image: photo, roleId }} size={isFirstPlace ? 24 : 12} isLink />
          <Box flexGrow={1}>
            <HStack spacing={1}>
              <PlayerName
                fontWeight={isFirstPlace ? 'bold' : 'medium'}
                letterSpacing="tight"
                user={{ name, id, roleId }}
                noOfLines={1}
                isLink
              />{' '}
              {isMe && (
                <Badge variant="solid" colorScheme="primary">
                  You
                </Badge>
              )}
            </HStack>
            <HStack fontSize="sm" color="grey.9">
              <Text>{wins} wins</Text>
              <Text>{losses} losses</Text>
            </HStack>
          </Box>
          <Box>
            <Badge fontWeight="medium" variant="subtle" css={{ fontVariantNumeric: 'tabular-nums' }}>
              {points} <PointIcon ml={0.5} />
            </Badge>
          </Box>
        </HStack>
      </Box>
    </MotionHStack>
  );
};

export default LeaderboardPosition;

import { NAVBAR_HEIGHT } from '@/components/Navbar/Navbar';
import FloatingActionButton from '@/components/shared/FloatingActionButton';
import LatestMatches from '@/components/shared/LatestMatches';
import Medal from '@/components/shared/Medal';
import { MotionBox } from '@/components/shared/Motion';
import PlayerAvatar from '@/components/shared/PlayerAvatar';
import PlayerName from '@/components/shared/PlayerName';
import SEO from '@/components/shared/SEO';
import Stat from '@/components/shared/Stat';
import type { UserGETAPIResponse } from '@/lib/api/handlers/user/getUserHandler';
import { createFetcher } from '@/lib/fetcher';
import useNavigationState from '@/lib/navigationHistory/useNavigationState';
import { getPlayerName } from '@/lib/players';
import { canViewDashboard, getRoleStyles } from '@/lib/roles';
import type { PlayerPageProps } from '@/pages/player/[id]';
import getGradientFromId from '@/theme/palettes';
import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  IconButton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { IoCloseOutline } from 'react-icons/io5';
import { VscEdit } from 'react-icons/vsc';
import { useSetBoast } from './hooks';

const PlayerPage: NextPage<PlayerPageProps> = ({ player, stats }) => {
  useNavigationState(getPlayerName(player?.name, 'initial') || 'Profile');
  const { data: session } = useSession();
  const { data: userQuery } = useQuery(
    ['users', player.id],
    createFetcher<UserGETAPIResponse>(`/api/users/${player.id}`)
  );

  const { setBoast, isLoading } = useSetBoast({ userId: player.id });

  const boastId = userQuery?.data?.boastId;
  const medals = userQuery?.data?.medals || [];

  const isMe = player.id === session?.user.id;

  const playerName = player.name || `Anonymous`;
  const hasMultipleGames = stats.games.length > 1;

  const boastedMedal = medals?.find(medal => medal.id === boastId);
  const otherMedals = medals?.filter(medal => medal.id !== boastId);

  return (
    <Container maxW="container.sm" pt={NAVBAR_HEIGHT}>
      <SEO title={`${playerName}’s profile`} />
      {canViewDashboard(session?.user.roleId) && (
        <FloatingActionButton
          buttons={[{ label: 'edit', icon: <VscEdit />, colorScheme: 'success', href: `/admin/users/${player.id}` }]}
        />
      )}
      <LayoutGroup id="medal-boast">
        <Stack spacing={{ base: 1, md: 0.5 }}>
          <Box bg="grey.1" borderRadius="18" overflow="hidden">
            <Box bg={getGradientFromId(player.id)} h="32" />
            <Box p={4} mt="-16">
              <PlayerAvatar user={player} size={32} />

              <HStack>
                <Heading as="h1" sx={getRoleStyles(player.roleId)} mt={2} size="lg">
                  <PlayerName user={player} />
                </Heading>
                {boastedMedal?.id && boastedMedal.seasonid && (
                  <MotionBox layoutId={boastedMedal.id} key={boastedMedal.id}>
                    <Medal id={boastedMedal.id} seasonId={boastedMedal.seasonid} />
                  </MotionBox>
                )}
                {isMe && boastedMedal && (
                  <AnimatePresence>
                    <MotionBox initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <IconButton
                        css={{ aspectRatio: '1' }}
                        size="sm"
                        isLoading={isLoading}
                        aria-label="Clear pin"
                        onClick={() => setBoast(null)}
                      >
                        <IoCloseOutline />
                      </IconButton>
                    </MotionBox>
                  </AnimatePresence>
                )}
              </HStack>
            </Box>
            {otherMedals.length > 0 && (
              <Box p={1} pb={0} userSelect="none">
                <Stack px={4} py={4} bg="grey.2" borderRadius="xl">
                  <Text fontSize="md" color="grey.9" mb={2}>
                    Badges{' '}
                    <Badge colorScheme="primary" variant="solid">
                      New!
                    </Badge>
                  </Text>
                  <HStack as="section" flexWrap="wrap" fontSize="2xl">
                    {otherMedals.map(
                      medal =>
                        medal.seasonid && (
                          <Stack key={medal.id} spacing={1} alignItems="center">
                            <MotionBox layoutId={medal.id}>
                              <Medal id={medal.id} seasonId={medal.seasonid} />
                            </MotionBox>

                            {isMe && (
                              <Button isLoading={isLoading} onClick={() => setBoast(medal.id)}>
                                Pin
                              </Button>
                            )}
                          </Stack>
                        )
                    )}
                  </HStack>
                </Stack>
              </Box>
            )}
            <HStack p="1" flexWrap={'wrap'} spacing={{ base: 1, md: 0.5 }} alignItems="stretch">
              <Stat label="Played" content={stats.played} />
              <Stat label="Won" content={stats.won} />
              <Stat label="Lost" content={stats.lost} />
            </HStack>
          </Box>

          <Stack spacing={6} pt={4}>
            <Tabs isLazy key={player.id}>
              <TabList>
                {hasMultipleGames && <Tab>All</Tab>}
                {stats.games.map(game => (
                  <Tab key={game.id}>
                    {game.icon} {game.name}
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                {hasMultipleGames && (
                  <TabPanel pt={8}>
                    <LatestMatches userId={player.id} />
                  </TabPanel>
                )}
                {stats.games.map(game => (
                  <TabPanel pt={8} key={game.id}>
                    <LatestMatches userId={player.id} gameId={game.id} />
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Stack>
        </Stack>
      </LayoutGroup>
    </Container>
  );
};

export default PlayerPage;

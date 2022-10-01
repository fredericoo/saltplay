import type { SlackMembersAPIResponse } from '@/pages/api/slack';
import type { ExistingSlackUsersAPIResponse } from '@/pages/api/slack/existing';
import { Box, HStack, Text } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { IoInformationCircleOutline } from 'react-icons/io5';
import PlayerPicker from './PlayerPicker';
import type { PlayerPickerProps } from './PlayerPicker/PlayerPicker';

type InvitePickerProps = Pick<PlayerPickerProps, 'selectedPlayers' | 'selectedColour' | 'onSelect'>;

const fetchUnregisteredSlackMembers = async () => {
  const allSlackReq = await axios.get<SlackMembersAPIResponse>('/api/slack').then(res => res.data);
  const allSlackMembers = allSlackReq.data?.members;
  const existingSlackUsers = await axios
    .get<ExistingSlackUsersAPIResponse>('/api/slack/existing')
    .then(res => res.data);

  if (!allSlackMembers || allSlackReq.status !== 'ok') throw new Error('No members found');

  return {
    status: allSlackReq.status,
    data: { members: allSlackMembers.filter(member => !existingSlackUsers.data?.userIds?.includes(member.id)) },
  };
};

const InvitePicker: React.FC<InvitePickerProps> = ({ selectedColour, selectedPlayers, onSelect }) => {
  const { data: invite, isError } = useQuery(['invite'], fetchUnregisteredSlackMembers, {
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

  return (
    <Box>
      <HStack bg="secondary.3" p={2} color="secondary.11" borderRadius="lg" mb={2}>
        <IoInformationCircleOutline size="1.2em" />
        <Text fontSize="sm" textAlign="center">
          Players you select will be notified and invited to join the app.
        </Text>
      </HStack>

      <PlayerPicker
        players={invite?.data?.members}
        isAlphabetical
        selectedPlayers={selectedPlayers}
        refetch={() => queryClient.invalidateQueries(['invite'])}
        isLoading={!invite?.data}
        isError={isError}
        onSelect={onSelect}
        selectedColour={selectedColour}
      />
    </Box>
  );
};

export default InvitePicker;

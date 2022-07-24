import type { SlackMembersAPIResponse } from '@/pages/api/slack';
import type { ExistingSlackUsersAPIResponse } from '@/pages/api/slack/existing';
import { Box, HStack, Text } from '@chakra-ui/react';
import axios from 'axios';
import { IoInformationCircleOutline } from 'react-icons/io5';
import useSWR from 'swr';
import ErrorBox from '../ErrorBox';
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

const InvitePicker: React.VFC<InvitePickerProps> = ({ selectedColour, selectedPlayers, onSelect }) => {
  const {
    data: invite,
    error,
    mutate,
  } = useSWR<SlackMembersAPIResponse>(`invite`, fetchUnregisteredSlackMembers, {
    revalidateOnFocus: false,
  });
  if (error) return <ErrorBox heading={["Couldn't load opponents", invite?.message].join(': ')} />;

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
        refetch={mutate}
        isLoading={!invite?.data}
        isError={error}
        onSelect={onSelect}
        selectedColour={selectedColour}
      />
    </Box>
  );
};

export default InvitePicker;

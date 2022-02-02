import { SlackMembersAPIResponse } from '@/pages/api/slack';
import { ExistingSlackUsersAPIResponse } from '@/pages/api/slack/existing';
import { Box, Text } from '@chakra-ui/react';
import axios from 'axios';
import useSWR from 'swr';
import ErrorBox from '../ErrorBox';
import PlayerPicker, { PlayerPickerProps } from '../PlayerPicker/PlayerPicker';

type InvitePickerProps = Pick<PlayerPickerProps, 'selectedPlayers' | 'selectedColour' | 'onSelect'>;

const fetchUnregisteredSlackMembers = async (_key: string) => {
  const allSlack = await axios.get<SlackMembersAPIResponse>('/api/slack').then(res => res.data);
  const existingSlackUsers = await axios
    .get<ExistingSlackUsersAPIResponse>('/api/slack/existing')
    .then(res => res.data);

  if (!allSlack.members) throw new Error('No members found');

  return { ...allSlack, members: allSlack.members.filter(member => !existingSlackUsers.userIds?.includes(member.id)) };
};

const InvitePicker: React.VFC<InvitePickerProps> = ({ selectedColour, selectedPlayers, onSelect }) => {
  const { data, error, mutate } = useSWR<SlackMembersAPIResponse>(`invite`, fetchUnregisteredSlackMembers, {
    revalidateOnFocus: false,
  });
  if (error || data?.status === 'error')
    return <ErrorBox heading={["Couldn't load opponents", data?.message].join(': ')} />;

  return (
    <Box>
      <Text fontSize="sm" py={4} textAlign="center" color="gray.600">
        The players you select will be invited to join SaltPlay and may reject the match.
      </Text>
      <PlayerPicker
        players={data?.members}
        isAlphabetical
        selectedPlayers={selectedPlayers}
        refetch={mutate}
        isLoading={!data}
        isError={error}
        onSelect={onSelect}
        selectedColour={selectedColour}
      />
    </Box>
  );
};

export default InvitePicker;

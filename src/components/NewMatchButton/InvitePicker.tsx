import fetcher from '@/lib/fetcher';
import { InvitePlayersAPIResponse } from '@/pages/api/players/invite';
import { Box, Text } from '@chakra-ui/react';
import useSWR from 'swr';
import ErrorBox from '../ErrorBox';
import PlayerPicker from '../PlayerPicker';
import { PlayerPickerProps } from '../PlayerPicker/PlayerPicker';

type InvitePickerProps = Pick<PlayerPickerProps, 'selectedPlayers' | 'selectedColour' | 'onSelect'>;

const InvitePicker: React.VFC<InvitePickerProps> = ({ selectedColour, selectedPlayers, onSelect }) => {
  const { data, error, mutate } = useSWR<InvitePlayersAPIResponse>(`/api/players/invite`, fetcher);
  if (error || data?.status === 'error')
    return <ErrorBox heading={["Couldn't load opponents", data?.message].join(': ')} />;

  return (
    <Box>
      <Text fontSize="sm" py={4} textAlign="center" color="gray.600">
        The players you select will be invited to join SaltPlay and may reject the match.
      </Text>
      <PlayerPicker
        players={data?.users}
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

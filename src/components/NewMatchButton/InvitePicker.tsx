import fetcher from '@/lib/fetcher';
import { InvitePlayersAPIResponse } from '@/pages/api/players/invite';
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
    <PlayerPicker
      players={data?.users}
      selectedPlayers={selectedPlayers}
      refetch={mutate}
      isLoading={!data}
      isError={error}
      onSelect={onSelect}
      selectedColour={selectedColour}
    />
  );
};

export default InvitePicker;

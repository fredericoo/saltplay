import fetcher from '@/lib/fetcher';
import { NonRegisteredUsersAPIResponse } from '@/pages/api/players/not-registered';
import useSWR from 'swr';
import PlayerPicker from '../PlayerPicker';

const InvitePlayer: React.VFC = () => {
  const { data, error } = useSWR<NonRegisteredUsersAPIResponse>('/api/players/not-registered', fetcher);
  if (error) {
    return <div>Error</div>;
  }
  return (
    <PlayerPicker
      selectedId="0"
      onSelect={() => {}}
      players={data?.users?.map(user => ({ ...user, scores: [] })) || []}
      isLoading={!data?.users}
    />
  );
};

export default InvitePlayer;

import DeleteButton from '@/components/DeleteButton';
import Settings from '@/components/Settings';
import { PlayerScoreDELETEAPIResponse } from '@/lib/api/handlers/playerScore/deletePlayerScoreHandler';
import { patchPlayerScoreSchema } from '@/lib/api/schemas';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { Game, PlayerScore } from '@prisma/client';
import axios from 'axios';
import { useState } from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import SettingsGroup from '../SettingsGroup';

type PlayerScoresProps = {
  scores: (Pick<PlayerScore, 'points' | 'id' | 'gameid'> & { game: Pick<Game, 'name' | 'icon'> })[];
  games: Pick<Game, 'id' | 'name'>[];
};

const PlayerScores: React.VFC<PlayerScoresProps> = ({ scores, games }) => {
  const [deletedScores, setDeletedScores] = useState<PlayerScore['id'][]>([]);

  const handleDeleteSession = async (id: PlayerScore['id']) => {
    const deletePlayerScore = await axios
      .delete<PlayerScoreDELETEAPIResponse>(`/api/scores/${id}`)
      .then(res => res.data);
    const deletedPlayerScoreId = deletePlayerScore.data?.id;
    if (deletedPlayerScoreId) {
      setDeletedScores(scores => [...scores, deletedPlayerScoreId]);
    }
  };

  return (
    <Stack spacing={8}>
      {scores
        ?.filter(score => !deletedScores.includes(score.id))
        .map(score => (
          <Box key={score.id}>
            <Heading size="md" px={4} py={2}>
              {score.game.name}
            </Heading>
            <SettingsGroup<PlayerScore>
              data={score}
              saveEndpoint={`/api/scores/${score.id}`}
              fields={[
                { id: 'points', type: 'number', label: 'Points' },
                {
                  id: 'gameid',
                  type: 'select',
                  label: 'Game',
                  options: games.map(game => ({ value: game.id, label: game.name })),
                },
              ]}
              fieldSchema={patchPlayerScoreSchema}
            >
              <Settings.Item label="Delete scores">
                <DeleteButton
                  onDelete={() => handleDeleteSession(score.id)}
                  keyword={`I want to remove ${score.game.name} scores for this player`}
                  variant="solid"
                  css={{ aspectRatio: '1' }}
                >
                  <IoTrashOutline />
                </DeleteButton>
              </Settings.Item>
            </SettingsGroup>
          </Box>
        ))}
    </Stack>
  );
};

export default PlayerScores;

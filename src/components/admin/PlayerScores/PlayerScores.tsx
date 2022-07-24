import ConfirmButton from '@/components/admin/ConfirmButton';
import Settings from '@/components/shared/Settings';
import type { PlayerScoreDELETEAPIResponse } from '@/lib/api/handlers/playerScore/deletePlayerScoreHandler';
import { patchPlayerScoreSchema } from '@/lib/api/schemas';
import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import type { Game, Office, PlayerScore } from '@prisma/client';
import axios from 'axios';
import { useState } from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import SettingsGroup from '../SettingsGroup';

type PlayerScoresProps = {
  scores: (Pick<PlayerScore, 'points' | 'id' | 'gameid'> & {
    game: Pick<Game, 'name' | 'icon'> & { office: Pick<Office, 'name'> };
  })[];
};

const PlayerScores: React.VFC<PlayerScoresProps> = ({ scores }) => {
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
            <Box as="header" px={4} py={2}>
              <Heading size="md">
                {score.game.icon} {score.game.name}
              </Heading>
              <Text color="grey.10" noOfLines={1}>
                {score.game.office?.name}
              </Text>
            </Box>
            <SettingsGroup
              data={score}
              saveEndpoint={`/api/scores/${score.id}`}
              fields={[{ id: 'points', type: 'number', label: 'Points' }]}
              fieldSchema={patchPlayerScoreSchema}
            >
              <Settings.Item label="Delete scores">
                <ConfirmButton
                  onConfirm={() => handleDeleteSession(score.id)}
                  keyword={`I want to remove ${score.game.name} scores for this player`}
                  variant="solid"
                  css={{ aspectRatio: '1' }}
                >
                  <IoTrashOutline />
                </ConfirmButton>
              </Settings.Item>
            </SettingsGroup>
          </Box>
        ))}
    </Stack>
  );
};

export default PlayerScores;

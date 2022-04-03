import DeleteButton from '@/components/DeleteButton';
import Editable from '@/components/Editable';
import PointIcon from '@/components/PointIcon';
import Settings from '@/components/Settings';
import { HStack, Input } from '@chakra-ui/react';
import { Game, PlayerScore } from '@prisma/client';
import axios from 'axios';
import { useState } from 'react';
import { IoTrashOutline } from 'react-icons/io5';

type PlayerScoresProps = { scores: (Pick<PlayerScore, 'points' | 'id'> & { game: Pick<Game, 'name' | 'icon'> })[] };

const PlayerScores: React.VFC<PlayerScoresProps> = ({ scores }) => {
  const [editingFieldKey, setEditingFieldKey] = useState<string | null>(null);
  const [response, setResponse] = useState<PlayerScore | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async ({ id, points }: Pick<PlayerScore, 'id' | 'points'>) => {
    setIsLoading(true);
    try {
      const res = await axios.patch(`/api/scores/${id}`, { points }).then(res => res.data);
      if (res.status === 'ok') {
        setEditingFieldKey(null);
        setResponse(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Settings.List>
      {scores?.map(score => (
        <Settings.Item key={score.id} label={score.game.icon + ' ' + score.game.name}>
          <HStack>
            <Editable
              onEdit={() => setEditingFieldKey(score.id)}
              onCancel={() => setEditingFieldKey(null)}
              onSave={({ id, value }) => handleSave({ id, points: +value })}
              isDisabled={isLoading && editingFieldKey !== score.id}
              id={score.id}
              isEditing={editingFieldKey === score.id}
              value={
                <>
                  {response?.points || score.points} <PointIcon />
                </>
              }
            >
              <Input
                name={score.id}
                textAlign="right"
                type="number"
                defaultValue={response?.points || score.points}
                autoFocus
              />
            </Editable>
            {editingFieldKey !== score.id && (
              <DeleteButton
                onDelete={() => {}}
                keyword={`I want to remove ${score.game.name} scores for this player`}
                variant="solid"
                css={{ aspectRatio: '1' }}
              >
                <IoTrashOutline />
              </DeleteButton>
            )}
          </HStack>
        </Settings.Item>
      ))}
    </Settings.List>
  );
};

export default PlayerScores;

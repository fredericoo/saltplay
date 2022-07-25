import createPlayerFromSlackId from './createPlayerFromSlackId';

/**
 * Given a list of players with id and source, returns User ids, creating new Users when necessary.
 * @param players An array of objects containing `id`, `source`.
 * @returns Promise that resolves to array of User.id.
 */
const getPlayerUserIds = async (players: { id: string; source?: string }[]) => {
  return await Promise.all(
    players.map(async player => {
      switch (player.source) {
        case 'slack':
          return await createPlayerFromSlackId(player.id);
        default:
          return player.id;
      }
    })
  );
};

export default getPlayerUserIds;

type ValidateTeamLengthOptions = { maxPlayersPerTeam: number; leftLength: number; rightLength: number };

/**
 * Validate team length for creation of match.
 * @returns boolean indicating whether team lengths are valid.
 */
const validateTeamLength = ({ maxPlayersPerTeam, leftLength, rightLength }: ValidateTeamLengthOptions) => {
  if (leftLength > maxPlayersPerTeam || rightLength > maxPlayersPerTeam) return false;

  return true;
};

export default validateTeamLength;

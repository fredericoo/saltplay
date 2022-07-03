type GetPointsToMove = (options: { matchPoints: number; leftLength: number; rightLength: number }) => number;

export const getPointsToMove: GetPointsToMove = ({ matchPoints, leftLength, rightLength }) => {
  return Math.ceil(matchPoints * Math.max(leftLength, rightLength));
};

type GetPlayerPointsToMove = (options: { pointsToMove: number; teamLength: number }) => number;

export const getPlayerPointsToMove: GetPlayerPointsToMove = ({ pointsToMove, teamLength }) =>
  Math.ceil(pointsToMove / teamLength);

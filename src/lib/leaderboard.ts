export const STARTING_POINTS = 100;
export const BASE_MATCH_POINTS = 10;
export const MIN_MATCH_POINTS = 1;

export const calculateMatchPoints = (p1TotalPoints: number, p2TotalPoints: number, pointsDifference: number) => {
  if (pointsDifference === 0) return 0;
  if (p1TotalPoints === 0 || p2TotalPoints === 0) return BASE_MATCH_POINTS;

  const winnerTotalPoints = pointsDifference > 0 ? p1TotalPoints : p2TotalPoints;
  const loserTotalPoints = pointsDifference > 0 ? p2TotalPoints : p1TotalPoints;
  const ratio = Math.abs(loserTotalPoints / winnerTotalPoints);

  const bigRatio = 1.2 * Math.log(2.9 * ratio - 0.6);
  const smallRatio = Math.tanh(1.1 * ratio) + 0.2;

  const multiplier = ratio < 1 ? smallRatio : bigRatio;

  const matchPoints = Math.max(Math.ceil(BASE_MATCH_POINTS * multiplier), MIN_MATCH_POINTS);

  return matchPoints;
};

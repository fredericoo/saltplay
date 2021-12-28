export const STARTING_POINTS = 100;
export const BASE_MATCH_POINTS = 10;

export const calculateMatchPoints = (p1TotalPoints: number, p2TotalPoints: number, pointsDifference: number) => {
  if (pointsDifference === 0) return 0;

  const winnerTotalPoints = pointsDifference > 0 ? p1TotalPoints : p2TotalPoints;
  const loserTotalPoints = pointsDifference > 0 ? p2TotalPoints : p1TotalPoints;

  const multiplier = Math.log10(Math.abs(loserTotalPoints / winnerTotalPoints) + 1) / Math.log10(2);
  const matchPoints = Math.floor(BASE_MATCH_POINTS * multiplier);

  return matchPoints;
};

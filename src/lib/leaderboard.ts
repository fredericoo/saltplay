export const STARTING_POINTS = 100;
export const BASE_MATCH_POINTS = 10;
export const MIN_MATCH_POINTS = 1;
export const MAX_MATCH_POINTS = 100;

export const calculateMatchPoints = (p1TotalPoints: number, p2TotalPoints: number, scoreDifference: number) => {
  if (scoreDifference === 0) return 0;
  const hasP1Won = scoreDifference > 0;

  const difference = Math.abs(p1TotalPoints - p2TotalPoints);

  const dimishingEquation = Math.ceil(9.99 - (1 / 20) * difference);
  const escalatingEqution = Math.ceil(9.01 + ((1 / 25) * difference) ** 2);

  if (hasP1Won) {
    return p1TotalPoints > p2TotalPoints
      ? Math.max(dimishingEquation, MIN_MATCH_POINTS)
      : Math.min(escalatingEqution, MAX_MATCH_POINTS);
  }

  return p1TotalPoints < p2TotalPoints
    ? Math.max(dimishingEquation, MIN_MATCH_POINTS)
    : Math.min(escalatingEqution, MAX_MATCH_POINTS);
};

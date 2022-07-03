import { getPointsToMove } from './points';
import { gen } from './testUtils';

describe('getPointsToMove', () => {
  test('when team length is equal, match points is multiplied by team length', () => {
    const teamLength = gen.int(1, 11);
    const matchPoints = gen.int(1, 100);
    const pointsToMove = getPointsToMove({ leftLength: teamLength, rightLength: teamLength, matchPoints });

    expect(pointsToMove).toBe(matchPoints * teamLength);
  });

  test('when team length is not equal, match points is multiplied by team with longest length', () => {
    const shorterLength = gen.int(1, 11);
    const longerLength = shorterLength + gen.int(1, 11);
    const matchPoints = gen.int(1, 100);

    const pointsToMoveWithLongerRightTeam = getPointsToMove({
      leftLength: shorterLength,
      rightLength: longerLength,
      matchPoints,
    });
    const pointsToMoveWithLongerLeftTeam = getPointsToMove({
      leftLength: longerLength,
      rightLength: shorterLength,
      matchPoints,
    });

    expect(pointsToMoveWithLongerRightTeam).toBe(matchPoints * longerLength);
    expect(pointsToMoveWithLongerLeftTeam).toBe(matchPoints * longerLength);
  });
});

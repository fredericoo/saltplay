import { BASE_MATCH_POINTS, calculateMatchPoints } from './leaderboard';

describe('Given players 1 and 2 TOTAL POINTS and the difference in MATCH SCORE between 1 and 2', () => {
  test('when both players have the same score, the match is worth the base points', () => {
    const p1Score = 100;
    const p2Score = 100;
    const pointsDifference = 1;
    const matchPoints = calculateMatchPoints(p1Score, p2Score, pointsDifference);
    expect(matchPoints).toBe(BASE_MATCH_POINTS);
  });
  test('player 1 with score 100 would take 13 matches to overtake player 2 with 1000 points total', () => {
    let p1Score = 100;
    let p2Score = 1000;
    let matchesWon = 0;

    const p1WinGame = () => {
      const matchPoints = calculateMatchPoints(p1Score, p2Score, 1);
      p1Score += matchPoints;
      p2Score -= matchPoints;
      matchesWon++;
    };

    while (p1Score < p2Score) p1WinGame();

    expect(matchesWon).toBe(13);
  });
});

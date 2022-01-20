import distributeMatchPoints from './distributeMatchPoints';
import prisma from '@/lib/prisma';
import { BASE_MATCH_POINTS } from './leaderboard';

const defaultArgs = {
  left: ['1', '2', '3'],
  right: ['4', '5', '6'],
  leftscore: 1,
  rightscore: 2,
  gameid: '1',
};
// @ts-ignore irrelevant type
jest.spyOn(prisma.playerScore, 'upsert').mockResolvedValue(null);

describe('Given a gameId, a score for each side and a list of player ids for each side, takes points from the loser side and distributes to the winner, returning the amount of points moved', () => {
  test('when one of the teams is empty, does nothing and returns 0', async () => {
    jest.spyOn(prisma.playerScore, 'findMany').mockResolvedValue([{ id: '1', gameid: '1', playerid: '1', points: 1 }]);
    const matchPoints = await distributeMatchPoints({
      ...defaultArgs,
      left: [],
    });
    expect(matchPoints).toBe(0);

    const matchPointsRight = await distributeMatchPoints({
      ...defaultArgs,
      right: [],
    });
    expect(matchPointsRight).toBe(0);
  });
  test('when no playerScores found for both players, returns base match points', async () => {
    jest.spyOn(prisma.playerScore, 'findMany').mockResolvedValue([]);
    const matchPoints = await distributeMatchPoints(defaultArgs);
    expect(matchPoints).toBe(BASE_MATCH_POINTS);
  });

  test('when leftScore is equal to rightScore, returns 0', async () => {
    jest.spyOn(prisma.playerScore, 'findMany').mockResolvedValue([{ id: '1', gameid: '1', playerid: '1', points: 1 }]);
    const matchPoints = await distributeMatchPoints({ ...defaultArgs, leftscore: 1, rightscore: 1 });
    expect(matchPoints).toBe(0);
  });

  test('when the average of points of both teams is equal to the same value, returns base points', async () => {
    jest.spyOn(prisma.playerScore, 'findMany').mockResolvedValueOnce([
      { id: '1', gameid: '1', playerid: '1', points: 1000 },
      { id: '1', gameid: '1', playerid: '1', points: 1000 },
      { id: '1', gameid: '1', playerid: '1', points: 1000 },
    ]);
    jest.spyOn(prisma.playerScore, 'findMany').mockResolvedValueOnce([
      { id: '1', gameid: '1', playerid: '1', points: 2000 },
      { id: '1', gameid: '1', playerid: '1', points: 1000 },
    ]);
    const matchPoints = await distributeMatchPoints({ ...defaultArgs });
    expect(matchPoints).toBe(BASE_MATCH_POINTS);
  });
});

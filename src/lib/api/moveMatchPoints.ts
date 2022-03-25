import { STARTING_POINTS } from '@/constants';
import prisma from '@/lib/prisma';
import { Match, User } from '@prisma/client';
import { getPlayerPointsToMove, getPointsToMove } from '../points';

/**
 * Moves points from the losing side to the winning side.
 * @param data.gameid The ID of the game.
 * @param data.left The left side of the match.
 * @param data.right The right side of the match.
 * @param data.pointsToMove The number of points to move from the losing side to the winning side.
 * @param data.leftToRight Whether the left side lost.
 * *positive* values move points from the right side to the left side, *negative* values move points from the left side to the right side.
 * @returns true if succeeded, false if failed.
 */
const moveMatchPoints = async (
  data: Pick<Match, 'gameid'> & { left: Pick<User, 'id'>[]; right: Pick<User, 'id'>[] } & {
    pointsToMove: number;
    leftToRight: boolean;
  }
) => {
  if (data.pointsToMove === 0) return true;

  type NewScore = {
    id: User['id'];
    operation: 'increment' | 'decrement';
    side: 'left' | 'right';
    pointsToMove: number;
  };

  const pointsToMove = getPointsToMove({
    leftLength: data.left.length,
    rightLength: data.right.length,
    matchPoints: data.pointsToMove,
  });

  const newScores = [
    ...data.left.map<NewScore>(user => ({
      id: user.id,
      operation: data.leftToRight ? 'decrement' : 'increment',
      side: 'left',
      pointsToMove: getPlayerPointsToMove({ pointsToMove, teamLength: data.left.length }),
    })),
    ...data.right.map<NewScore>(user => ({
      id: user.id,
      operation: data.leftToRight ? 'increment' : 'decrement',
      side: 'right',
      pointsToMove: getPlayerPointsToMove({ pointsToMove, teamLength: data.right.length }),
    })),
  ];

  await prisma.$transaction(
    newScores.map(player =>
      prisma.playerScore.upsert({
        where: { gameid_playerid: { gameid: data.gameid, playerid: player.id } },
        update: {
          points: { [player.operation]: player.pointsToMove },
        },
        create: {
          points: STARTING_POINTS + (player.operation === 'increment' ? player.pointsToMove : -player.pointsToMove),
          gameid: data.gameid,
          playerid: player.id,
        },
      })
    )
  );
};

export default moveMatchPoints;

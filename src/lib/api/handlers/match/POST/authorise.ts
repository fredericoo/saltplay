import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';

type AuthorisePostMatchOptions = {
  req: NextApiRequest;
  res: NextApiResponse;
  players: Pick<User, 'id'>[];
};

/**
 * Authorise a user to create a match
 * @param AuthorisePostMatchOptions - Options for authorisation
 * @returns boolean indicating whether the user is authorised to create a match.
 */
const authorise = async ({ req, res, players }: AuthorisePostMatchOptions) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  if (!session) return false;

  if (session.user.roleId !== 0 && !players.find(p => p.id === session.user.id)) return false;

  return true;
};

export default authorise;

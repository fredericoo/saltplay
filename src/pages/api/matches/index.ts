import deleteMatchesHandler from '@/lib/api/handlers/match/deleteMatchesHandler';
import getMatchesHandler from '@/lib/api/handlers/match/getMatchesHandler';
import postMatchesHandler from '@/lib/api/handlers/match/postMatchesHandler';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _req, res) => {
    console.error(err.stack);
    res.status(500).end('Internal server error');
  },
})
  .get(getMatchesHandler)
  .post(postMatchesHandler)
  .delete(deleteMatchesHandler);

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};

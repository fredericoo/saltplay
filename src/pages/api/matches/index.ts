import deleteMatchesHandler from '@/lib/api/handlers/match/deleteMatchesHandler';
import getMatchesHandler from '@/lib/api/handlers/match/getMatchesHandler';
import postMatchHandler from '@/lib/api/handlers/match/POST';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _req, res) => {
    console.error(err.stack);
    res.status(500).end('Internal server error');
  },
})
  .get(getMatchesHandler)
  .post(postMatchHandler)
  .delete(deleteMatchesHandler);

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};

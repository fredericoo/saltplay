import deleteMatchesHandler from '@/lib/api/handlers/deleteMatchesHandler';
import getMatchesHandler from '@/lib/api/handlers/getMatchesHandler';
import postMatchesHandler from '@/lib/api/handlers/postMatchesHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).end('Internal server error');
  },
})
  .get(getMatchesHandler)
  .post(postMatchesHandler)
  .delete(deleteMatchesHandler);

export default handler;

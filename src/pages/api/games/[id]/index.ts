import deleteGameHandler from '@/lib/api/handlers/game/deleteGameHandler';
import patchGameHandler from '@/lib/api/handlers/game/patchGameHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _req, res) => {
    console.error(err.stack);
    res.status(500).end('Internal server error');
  },
})
  .patch(patchGameHandler)
  .delete(deleteGameHandler);

export default handler;

import deleteSessionsHandler from '@/lib/api/handlers/sessions/deleteSessionsHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).end('Internal server error');
  },
}).delete(deleteSessionsHandler);

export default handler;

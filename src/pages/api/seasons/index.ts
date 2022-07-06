import postSeasonHandler from '@/lib/api/handlers/season/postSeasonHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _req, res) => {
    console.error(err.stack);
    res.status(500).end('Internal server error');
  },
}).post(postSeasonHandler);

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};

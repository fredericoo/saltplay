import getSeasonMedalsHandler from '@/lib/api/handlers/season/getSeasonMedalsHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _req, res) => {
    console.error(err.stack);
    res.status(500).end('Internal server error');
  },
}).get(getSeasonMedalsHandler);

export default handler;

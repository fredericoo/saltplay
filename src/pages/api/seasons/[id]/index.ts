import deleteSeasonHandler from '@/lib/api/handlers/season/deleteSeasonHandler';
import patchSeasonHandler from '@/lib/api/handlers/season/patchSeasonHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _req, res) => {
    console.error(err.stack);
    res.status(500).end('Internal server error');
  },
})
  .delete(deleteSeasonHandler)
  .patch(patchSeasonHandler);

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};

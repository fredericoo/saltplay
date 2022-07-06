import getUserHandler from '@/lib/api/handlers/user/getUserHandler';
import patchUserHandler from '@/lib/api/handlers/user/patchUserHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _req, res) => {
    console.error(err.stack);
    res.status(500).end('Internal server error');
  },
})
  .get(getUserHandler)
  .patch(patchUserHandler);

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};

import deleteOfficeHandler from '@/lib/api/handlers/office/deleteOfficeHandler';
import patchOfficeHandler from '@/lib/api/handlers/office/patchOfficeHandler';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _req, res) => {
    console.error(err.stack);
    res.status(500).end('Internal server error');
  },
})
  .patch(patchOfficeHandler)
  .delete(deleteOfficeHandler);

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};

import deleteOfficeHandler from '@/lib/api/handlers/office/deleteOfficeHandler';
import patchOfficeHandler from '@/lib/api/handlers/office/patchOfficeHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).end('Internal server error');
  },
})
  .patch(patchOfficeHandler)
  .delete(deleteOfficeHandler);

export default handler;

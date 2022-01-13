import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { APIResponse } from '@/lib/types/api';
import { serialize } from 'cookie';

export type DevUsersAPIResponse = APIResponse;

const devUsersHandler: NextApiHandler<DevUsersAPIResponse> = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN !== 'true')
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });

  const userid = req.body.userid;
  if (typeof userid !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid user id' });

  const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  await prisma.session.create({
    data: {
      expires,
      sessionToken,
      user: {
        connect: {
          id: userid,
        },
      },
    },
  });

  res.setHeader(
    'Set-Cookie',
    serialize(
      process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      sessionToken,
      { path: '/', expires }
    )
  );

  res.status(200).json({
    status: 'ok',
  });
};

export default devUsersHandler;

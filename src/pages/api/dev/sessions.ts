import { aliasAndSetUser } from '@/lib/mixpanel';
import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { serialize } from 'cookie';
import { NextApiHandler } from 'next';

export type DevUsersAPIResponse = APIResponse;

const devUsersHandler: NextApiHandler<DevUsersAPIResponse> = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  if (process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN !== 'true')
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });

  const userid = req.body.userid;
  if (typeof userid !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid user id' });

  const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  const session = await prisma.session.create({
    data: {
      expires,
      sessionToken,
      user: {
        connect: {
          id: userid,
        },
      },
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  res.setHeader(
    'Set-Cookie',
    serialize(
      process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      sessionToken,
      { path: '/', expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' }
    )
  );

  session.user && aliasAndSetUser(session.user);

  res.status(200).json({
    status: 'ok',
  });
};

export default devUsersHandler;

import getAllSlackMembers from '@/lib/slack/getAllSlackMembers';
import { APIResponse } from '@/lib/types/api';
import { NextApiHandler } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';

export type SlackMembersAPIResponse = APIResponse<{
  members: Awaited<ReturnType<typeof getAllSlackMembers>>;
}>;

const slackMembersHandler: NextApiHandler<SlackMembersAPIResponse> = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });

  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  if (!session) return res.status(403).json({ status: 'error', message: 'Not logged in' });
  const members = await getAllSlackMembers();

  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400');
  res.status(200).json({ status: 'ok', data: { members } });
};

export default slackMembersHandler;

export const config = {
  api: {
    externalResolver: true,
  },
};

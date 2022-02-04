import getAllSlackMembers from '@/lib/slackbot/getAllSlackMembers';
import { APIResponse } from '@/lib/types/api';
import { PromiseElement } from '@/lib/types/utils';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';

export type SlackMembersAPIResponse = APIResponse<{
  members: PromiseElement<ReturnType<typeof getAllSlackMembers>>;
}>;

const slackMembersHandler: NextApiHandler<SlackMembersAPIResponse> = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });

  const session = await getServerSession({ req, res }, nextAuthOptions);
  if (!session) return res.status(403).json({ status: 'error', message: 'Not logged in' });
  const members = await getAllSlackMembers();

  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400');
  res.status(200).json({ status: 'ok', members });
};

export default slackMembersHandler;

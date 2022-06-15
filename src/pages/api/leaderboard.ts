import getLeaderboardHandler from '@/lib/api/handlers/leaderboard/getLeaderboardHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _req, res) => {
    console.error(err.stack);
    res.status(500).end('Internal server error');
  },
}).get(getLeaderboardHandler);

export default handler;

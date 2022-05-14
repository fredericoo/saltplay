import type { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const path = req.query.path;
    if (typeof path === 'string') {
      await res.unstable_revalidate(path);
    } else {
      await Promise.all(
        path.map(async path => {
          await res.unstable_revalidate(path);
        })
      );
    }
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
};

export default handler;

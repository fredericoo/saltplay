import type { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const path = req.query.path;
  if (!path) return res.status(400).json({ message: 'Missing path' });

  try {
    if (typeof path === 'string') {
      await res.revalidate(path);
    } else {
      await Promise.all(
        path.map(async path => {
          await res.revalidate(path);
        })
      );
    }
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
};

export default handler;

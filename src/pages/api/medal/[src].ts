import medals from '@/lib/medals';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = (req, res) => {
  if (typeof req.query?.src !== 'string' || typeof req.query.bg !== 'string' || typeof req.query.icon !== 'string') {
    return res.status(404).end();
  }
  if (!req.query.src.endsWith('.svg')) {
    return res.status(404).end();
  }

  const src = req.query.src.replace(/\.svg$/, '');

  if (!(src in medals)) {
    return res.status(404).end();
  }

  const medalSvg = medals[src]({ bgColor: req.query.bg, icon: req.query.icon });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'image/svg+xml');
  process.env.NODE_ENV === 'production' &&
    res.setHeader('Cache-Control', 'public, immutable, no-transform, s-maxage=31536000, max-age=31536000');
  res.end(medalSvg);
};

export default handler;

import medals from '@/lib/medals';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = (req, res) => {
  if (typeof req.query?.src !== 'string' || typeof req.query.bg !== 'string' || typeof req.query.icon !== 'string') {
    return res.status(404).end();
  }
  if (!req.query.src.endsWith('.svg')) {
    return res.status(404).end();
  }

  const src = req.query.src.replace(/(_holo)*\.svg$/, '');
  const isHolo = req.query.src.endsWith('_holo.svg');

  const isValidMedal = (src: string): src is keyof typeof medals => {
    return src in medals;
  };

  if (!isValidMedal(src)) {
    return res.status(404).end();
  }

  const holo = medals[src].holo;
  const medalFn = holo && isHolo ? holo : medals[src].medal;

  const medalSvg = medalFn({ bgColor: req.query.bg, icon: req.query.icon });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'image/svg+xml');
  process.env.NODE_ENV === 'production' &&
    res.setHeader('Cache-Control', 'public, immutable, no-transform, s-maxage=31536000, max-age=31536000');
  res.end(medalSvg);
};

export default handler;

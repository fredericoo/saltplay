import type { NextApiHandler } from 'next';
import { createApi } from 'unsplash-js';
import { Basic as UnsplashPhoto } from 'unsplash-js/dist/methods/photos/types';

type Error = {
  status: 'error';
  message: string;
  photo?: never;
};

type Data = {
  status: 'ok';
  message?: never;
  photo: UnsplashPhoto;
};

export type RandomPhotoApiResponse = Error | Data;

const handler: NextApiHandler<RandomPhotoApiResponse> = async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  if (req.method !== 'GET') {
    res.status(403).json({ status: 'error', message: 'Invalid method' });
    return;
  }

  const accessKey = process.env.UNSPLASH_API_KEY;

  if (!accessKey) {
    res.status(403).json({ status: 'error', message: 'Missing UNSPLASH_API_KEY' });
    return;
  }

  const unsplash = createApi({
    accessKey,
  });

  const query = Array.isArray(req.query.q) ? req.query.q.join('') : req.query.q;
  const perPage = req.query.perPage ? Math.min(+req.query.perPage, 20) : 5;

  const unsplashQuery = await unsplash?.search.getPhotos({ query, perPage });
  const results = unsplashQuery?.response?.results;

  if (!results) {
    res.status(404).json({ status: 'error', message: 'No results found' });
    return;
  }

  res.status(200).json({
    status: 'ok',
    photo: results[Math.floor(Math.random() * results.length)],
  });
};

export default handler;

import { APIResponse } from '@/lib/types/api';
import type { NextApiHandler } from 'next';
import { createApi } from 'unsplash-js';
import { Basic as UnsplashPhoto } from 'unsplash-js/dist/methods/photos/types';

export type RandomPhotoApiResponse = APIResponse<{ photo: UnsplashPhoto }>;

const accessKey = process.env.UNSPLASH_API_KEY;

const getUnsplashRandomImage = async (query: string, perPage?: number) => {
  if (!accessKey) return null;
  const unsplash = createApi({
    accessKey,
  });
  const unsplashQuery = await unsplash?.search.getPhotos({ query, perPage });
  const results = unsplashQuery?.response?.results;
  if (!results) return null;
  return results[Math.floor(Math.random() * results.length)];
};

const handler: NextApiHandler<RandomPhotoApiResponse> = async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  if (req.method !== 'GET') {
    res.status(403).json({ status: 'error', message: 'Invalid method' });
    return;
  }

  if (!accessKey) {
    res.status(403).json({ status: 'error', message: 'Missing UNSPLASH_API_KEY' });
    return;
  }

  const query = Array.isArray(req.query.q) ? req.query.q.join('') : req.query.q;
  const perPage = req.query.perPage ? Math.min(+req.query.perPage, 20) : 5;
  const randomPhoto = await getUnsplashRandomImage(query, perPage);

  if (!randomPhoto) {
    res.status(404).json({ status: 'error', message: 'No photo found' });
    return;
  }

  res.status(200).json({
    status: 'ok',
    photo: randomPhoto,
  });
};

export default handler;

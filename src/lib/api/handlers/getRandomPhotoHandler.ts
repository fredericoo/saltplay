import { APIResponse } from '@/lib/types/api';
import axios from 'axios';
import type { NextApiHandler } from 'next';
import type { Basic as UnsplashPhoto } from 'unsplash-js/dist/methods/photos/types';
import { object, string } from 'yup';

export type RandomPhotoApiResponse = APIResponse<{ photo: UnsplashPhoto }>;

const querySchema = object({
  q: string().required(),
});

const accessKey = process.env.UNSPLASH_API_KEY;

const getUnsplashRandomImage = async (query: string) => {
  if (!accessKey) return null;
  const results = await axios
    .get(`https://api.unsplash.com/search/photos?page=1&query=${query}`, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    })
    .then(res => res?.data?.results || {});
  if (!results) return null;
  return results[Math.floor(Math.random() * results.length)];
};

const getRandomPhotoHandler: NextApiHandler<RandomPhotoApiResponse> = async (req, res) => {
  if (!accessKey) {
    res.status(403).json({ status: 'error', message: 'Missing UNSPLASH_API_KEY' });
    return;
  }
  querySchema
    .validate(req.query, { abortEarly: false })
    .then(async ({ q }) => {
      const randomPhoto = await getUnsplashRandomImage(q);
      if (!randomPhoto) {
        res.status(404).json({ status: 'error', message: 'No photo found' });
        return;
      }
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
      res.status(200).json({
        status: 'ok',
        photo: randomPhoto,
      });
    })
    .catch(err => {
      res.status(400).json({ status: 'error', message: err.message });
    });
};

export default getRandomPhotoHandler;

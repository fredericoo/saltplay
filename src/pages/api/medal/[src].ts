import medals from '@/lib/medals';
import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge',
};

const handler = (req: NextRequest) => {
  const { searchParams, pathname } = new URL(req.url);
  const query = { src: pathname.match(/.+\/(.+)/)?.[1], bg: searchParams.get('bg'), icon: searchParams.get('icon') };

  if (!query.src || typeof query.bg !== 'string' || typeof query.icon !== 'string') {
    return new Response('Invalid query', {
      status: 401,
      headers: {
        'content-type': 'text/plain',
      },
    });
  }
  if (!query.src.endsWith('.svg')) {
    return new Response('Image has to be a SVG', {
      status: 401,
      headers: {
        'content-type': 'text/plain',
      },
    });
  }

  const src = query.src.replace(/(_holo)*\.svg$/, '');
  const isHolo = query.src.endsWith('_holo.svg');

  const isValidMedal = (src: string): src is keyof typeof medals => {
    return src in medals;
  };

  if (!isValidMedal(src)) {
    return new Response('No medal found with provided src', {
      status: 404,
      headers: {
        'content-type': 'text/plain',
      },
    });
  }

  const holo = medals[src].holo;
  const medalFn = holo && isHolo ? holo : medals[src].medal;

  const medalSvg = medalFn({ bgColor: query.bg, icon: query.icon });

  return new Response(medalSvg, {
    status: 200,
    headers: {
      'content-type': 'image/svg+xml',
      'cache-control': 'public, immutable, no-transform, s-maxage=31536000, max-age=31536000',
    },
  });
};

export default handler;

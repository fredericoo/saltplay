/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*{/fonts}?',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public,max-age=31536000,immutable',
          },
        ],
      },
      {
        source: '/:path*{/splashscreens}?',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public,max-age=31536000,immutable',
          },
        ],
      },
    ];
  },
};

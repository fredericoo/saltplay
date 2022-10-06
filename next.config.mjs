import nextBundleAnalyser from '@next/bundle-analyzer';

// https://securityheaders.com
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  child-src 'none';
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self';
`;

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: `accelerometer=(),autoplay=(),camera=(),encrypted-media=(),fullscreen=(),geolocation=(),gyroscope=(),magnetometer=(),microphone=(),midi=(),sync-xhr=*,usb=(),xr-spatial-tracking=()`,
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
];

const nextConfig = {
  headers: () => [
    {
      source: '/',
      headers: securityHeaders,
    },
    {
      source: '/:path*',
      headers: securityHeaders,
    },
  ],
  reactStrictMode: true,
  swcMinify: false,
  images: {
    deviceSizes: [768, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    domains: ['avatars.slack-edge.com', 'secure.gravatar.com', 'cloudflare-ipfs.com'],
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    reactRemoveProperties: process.env.REMOVE_PROPERTIES === 'true',
    emotion: {
      sourceMap: true,
      autoLabel: 'always',
    },
  },
  experimental: {
    legacyBrowsers: false,
    browsersListForSwc: true,
  },
};

const withBundleAnalyser = nextBundleAnalyser({
  enabled: process.env.ANALYSE === 'true',
});

export default withBundleAnalyser(nextConfig);

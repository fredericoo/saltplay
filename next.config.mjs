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
  swcMinify: true,
  images: {
    images: {
      deviceSizes: [768, 1920],
      imageSizes: [16, 32, 48, 64, 96, 128, 256],
    },
    domains: ['avatars.slack-edge.com', 'secure.gravatar.com'],
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    reactRemoveProperties: process.env.REMOVE_PROPERTIES === 'true',
  },
  experimental: {
    emotion: {
      // default is true. It will be disabled when build type is production.
      sourceMap: true,
      // default is 'dev-only'.
      autoLabel: 'dev-only',
      // default is '[local]'.
      // Allowed values: `[local]` `[filename]` and `[dirname]`
      // This option only works when autoLabel is set to 'dev-only' or 'always'.
      // It allows you to define the format of the resulting label.
      // The format is defined via string where variable parts are enclosed in square brackets [].
      // For example labelFormat: "my-classname--[local]", where [local] will be replaced with the name of the variable the result is assigned to.
      labelFormat: '[local]',
    },
  },
};

const withBundleAnalyser = nextBundleAnalyser({
  enabled: process.env.ANALYSE === 'true',
});

export default withBundleAnalyser(nextConfig);

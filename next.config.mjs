import nextBundleAnalyser from '@next/bundle-analyzer';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    reactRemoveProperties: true,
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

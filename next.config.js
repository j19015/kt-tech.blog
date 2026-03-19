/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      'images.microcms-assets.io',
      'images.unsplash.com',
      'pub-9d03846db4364486bb0806774184931a.r2.dev',
      'www.notion.so',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
    ],
  },
};

module.exports = nextConfig;

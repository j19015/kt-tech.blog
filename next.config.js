/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;

module.exports = {
  images: {
    domains: ['images.microcms-assets.io'], // 使用するホスト名をここに追加
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/learn.html', destination: '/platform#learn', permanent: true },
      { source: '/learn',      destination: '/platform#learn', permanent: true },
      { source: '/index.html', destination: '/', permanent: true },
    ];
  },
};
module.exports = nextConfig;

/** @type {import('next').NextConfig} */
// reactStrictMode:false on purpose for the scaffold — strict mode double-invokes effects in dev,
// which would double-inject the scripts (nav rendered twice, etc.). Real fix = guard re-runs.
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      { source: '/learn.html', destination: '/platform#learn', permanent: true },
      { source: '/index.html', destination: '/', permanent: true },
    ];
  },
};
module.exports = nextConfig;

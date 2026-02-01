/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  reactStrictMode: true,
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/workflows",
        permanent: false,
      },
    ];
  },
};

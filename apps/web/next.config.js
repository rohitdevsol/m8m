/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  reactStrictMode: true,
  devIndicators: false,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/workflows",
  //       permanent: false,
  //     },
  //   ];
  // },
};

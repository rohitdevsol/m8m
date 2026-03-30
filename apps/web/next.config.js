/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  reactStrictMode: true,
  devIndicators: false,
  output: 'standalone',
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

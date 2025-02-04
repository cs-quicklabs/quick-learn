// //@ts-check

// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const { composePlugins, withNx } = require('@nx/next');

// /**
//  * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
//  **/
// const nextConfig = {
//   nx: {
//     // Set this to true if you would like to use SVGR
//     // See: https://github.com/gregberge/svgr
//     svgr: false,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: process.env.BUCKET_URL || '',
//       },
//     ],
//   },
//   transpilePackages: ['flowbite-react'],
//   rewrites: async () => {
//     return [
//       {
//         source: '/api/:path*',
//         destination: `${
//           process.env.BACKEND_BASE_API_URL || 'http://localhost:3001/api'
//         }/:path*`,
//       },
//     ];
//   },
// };

// const plugins = [
//   // Add more Next.js plugins to this list if needed.
//   withNx,
// ];

// module.exports = composePlugins(...plugins)(nextConfig);



//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.BUCKET_URL || '',
      },
      {
        protocol: 'https',
        hostname: 'www.example.com',
        pathname: '/**',
      },
      // Add localhost for development
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      // Add any other domains you need
    ],
    // For older Next.js versions or simpler configuration, you can also use domains:
    domains: [
      process.env.BUCKET_URL || '',
      'www.example.com',
      'localhost',
    ],
  },
  transpilePackages: ['flowbite-react'],
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: `${
          process.env.BACKEND_BASE_API_URL || 'http://localhost:3001/api'
        }/:path*`,
      },
    ];
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
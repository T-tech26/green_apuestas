import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.fotmob.com',
      },
      {
        protocol: 'https',
        hostname: 'cloud.appwrite.io',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'greenapuestas.com', // If the domain is mydomain.com
          },
        ],
        destination: 'https://www.greenapuestas.com', // Redirect to www.mydomain.com
        permanent: true, // Permanent redirect
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pj5l4armph5dlvo8.public.blob.vercel-storage.com',
        port: '',
      },
    ],
  },
};

export default nextConfig;

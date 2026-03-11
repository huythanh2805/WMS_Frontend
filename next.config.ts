import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: ['utfs.io'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

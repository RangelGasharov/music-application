import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'raspberrypi',
        port: '9002',
        pathname: '/music-application/**',
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      // ✅ LOCAL API (https://localhost:7196/**)
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '7196',
        pathname: '/**',   // ✅ allow ALL paths
      },

      // ✅ PRODUCTION API (https://testapi.knowledgemarkg.com/**)
      {
        protocol: 'https',
        hostname: 'testapi.knowledgemarkg.com',
        pathname: '/**',   // ✅ allow ALL paths
      },
    ],
  },
}

export default nextConfig

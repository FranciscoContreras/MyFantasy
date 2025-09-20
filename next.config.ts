import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "sleepercdn.com" }],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 480, 768, 1024, 1280, 1536, 1920],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
}

export default nextConfig

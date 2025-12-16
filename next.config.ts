import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 95],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

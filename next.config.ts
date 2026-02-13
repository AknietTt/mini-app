import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for Docker
  output: "standalone",
  basePath: "/mini",
  assetPrefix: "/mini",
  trailingSlash: false,
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Docker
  output: "standalone",
  basePath: "/mini",
  assetPrefix: "/mini",
  trailingSlash: false,
};

export default nextConfig;

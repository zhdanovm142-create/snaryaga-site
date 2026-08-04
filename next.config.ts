import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — full SSG/SPA, no Node.js server at runtime.
  output: "export",
  // Next/Image optimization requires a server; disable it for static export.
  images: {
    unoptimized: true,
  },
  // Trailing slashes so exported folders serve index.html on any static host.
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;

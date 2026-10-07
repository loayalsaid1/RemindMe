import { createRequire } from "module";
import type { NextConfig } from "next";

const require = createRequire(import.meta.url);
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const backend = process.env.API_PROXY_TARGET ?? "http://localhost:5001";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
  allowedDevOrigins: [".monkeycode-ai.live"],
};

export default withPWA(nextConfig);

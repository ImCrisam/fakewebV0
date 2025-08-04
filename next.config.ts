import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  images: {
    domains: ["raw.githubusercontent.com"],
    unoptimized: true,
  },
  output: 'export',
  basePath: isProd ? '/fakewebV0' : '',
  assetPrefix: isProd ? '/fakewebV0/' : '',

  env: {
    NEXT_PUBLIC_ASSET_PREFIX: isProd ? '/fakewebV0/_next/static/' : '',
  },
};

export default nextConfig;
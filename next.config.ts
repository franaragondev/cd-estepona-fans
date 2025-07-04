import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.cdesteponafans.com",
        port: "",
      },
    ],
  },
  productionBrowserSourceMaps: true,
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

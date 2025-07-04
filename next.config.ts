import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["res.cloudinary.com", "www.cdesteponafans.com"],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

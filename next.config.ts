import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    const externals = config.externals ?? [];
    if (Array.isArray(externals)) {
      externals.push("pino-pretty", "lokijs", "encoding");
      config.externals = externals;
    } else {
      config.externals = [
        externals,
        "pino-pretty",
        "lokijs",
        "encoding",
      ];
    }

    return config;
  },
};

export default nextConfig;

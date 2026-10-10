import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1","192.168.1.4"],
  async redirects() {
    return [
      {
        source: "/playground/mistral",
        destination: "/playground/phi",
        permanent: false,
      },
    ]
  },
};

export default nextConfig;

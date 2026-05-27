import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; font-src 'self' https: data: *.vercel.com *.gstatic.com vercel.live *.public.blob.vercel-storage.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
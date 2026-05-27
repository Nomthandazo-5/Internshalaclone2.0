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
            value: `
              default-src 'self';
              connect-src 'self' https://internshalaclone2-0-1.onrender.com;
              img-src 'self' data: blob: https:;
              font-src 'self' https: data:;
              style-src 'self' 'unsafe-inline';
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
            `
              .replace(/\n/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
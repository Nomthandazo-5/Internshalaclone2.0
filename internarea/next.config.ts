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
              connect-src 'self' https://internshalaclone2-0-1.onrender.com https://*.googleapis.com https://*.firebaseapp.com https://*.gstatic.com;
              img-src 'self' data: blob: https:;
              font-src 'self' https: data:;
              style-src 'self' 'unsafe-inline';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.gstatic.com;
              frame-src 'self' https://accounts.google.com https://*.firebaseapp.com;
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
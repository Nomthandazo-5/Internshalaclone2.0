/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; font-src 'self' https: data: *.vercel.com *.gstatic.com vercel.live;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
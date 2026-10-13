/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "framerusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/images/logo.png",
      },
      {
        source: "/logo.png",
        destination: "/images/logo.png",
      },
      {
        source: "/api/:path*",
        destination: "https://portfolio-nu-ten-27.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;

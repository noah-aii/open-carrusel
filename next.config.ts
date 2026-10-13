import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp", "archiver", "puppeteer"],
  // Files added to public/ after the build (library photos, uploads) fall through to the file route.
  async rewrites() {
    return [
      { source: "/library/:path+", destination: "/api/files/library/:path+" },
      { source: "/uploads/:path+", destination: "/api/files/uploads/:path+" },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "frame-src 'self' blob:",
              "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

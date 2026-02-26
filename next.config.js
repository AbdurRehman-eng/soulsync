const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    // Runtime caching for API routes and assets
    runtimeCaching: [
      {
        // Cache API feed responses for 5 minutes
        urlPattern: /\/api\/feed/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "api-feed-cache",
          expiration: { maxEntries: 10, maxAgeSeconds: 300 },
        },
      },
      {
        // Cache mood API for 1 hour
        urlPattern: /\/api\/mood/,
        handler: "CacheFirst",
        options: {
          cacheName: "api-mood-cache",
          expiration: { maxEntries: 5, maxAgeSeconds: 3600 },
        },
      },
      {
        // Cache interaction reads (liked cards) for 2 minutes
        urlPattern: /\/api\/interactions\?/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "api-interactions-cache",
          expiration: { maxEntries: 10, maxAgeSeconds: 120 },
        },
      },
      {
        // Cache leaderboard for 10 minutes
        urlPattern: /\/api\/leaderboard/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "api-leaderboard-cache",
          expiration: { maxEntries: 5, maxAgeSeconds: 600 },
        },
      },
      {
        // Cache images aggressively
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "image-cache",
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      {
        // Cache Google Fonts
        urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-cache",
          expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
        },
      },
      {
        // Cache JS/CSS bundles
        urlPattern: /\/_next\/static\/.*/,
        handler: "CacheFirst",
        options: {
          cacheName: "next-static-cache",
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  async rewrites() {
    return [
      // Serve PWA manifest icons via API until public/icons/ has real files
      { source: "/icons/:path*", destination: "/api/icons/:path*" },
    ];
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@supabase/supabase-js",
      "@supabase/ssr",
      "date-fns",
      "react-hot-toast",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [390, 430, 640, 750, 828, 1080],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256],
  },
  // Security + caching headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        source: "/mascot/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, immutable" },
        ],
      },
      {
        source: "/icons/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, immutable" },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);

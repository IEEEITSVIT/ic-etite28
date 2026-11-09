
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Certificate template uploads go through server actions.
  experimental: { serverActions: { bodySizeLimit: "3mb" } },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [60, 75, 85, 90, 100],
  },
};

export default nextConfig;

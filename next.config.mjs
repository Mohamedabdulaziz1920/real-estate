// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Pexels
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      // Google Profile Pictures
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      // UploadThing (إذا كنت تستخدمه)
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        pathname: '/**',
      },
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/**',
      },
      // إضافة localhost بدون port للأوراق الذكية
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      // صور المستخدمين المرفوعة
      {
        protocol: 'https',
        hostname: '**', // السماح بجميع النطاقات HTTPS (يمكنك تقييدها لاحقاً)
      },
    ],
    // إعدادات إضافية للصور
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // إضافة unoptimized للتنمية
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // إعدادات تجريبية
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  
  // تجاهل أخطاء ESLint أثناء البناء
  eslint: {
    ignoreDuringBuilds: true, // غير إلى true لتجاهل تحذيرات ESLint أثناء البناء
  },
  
  // تجاهل أخطاء TypeScript أثناء البناء
  typescript: {
    ignoreBuildErrors: false, // اترك false لمشاهدة أخطاء TypeScript
  },

  // إضافة headers للأمان
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  },

  // إعدادات webpack
  webpack: (config, { dev, isServer }) => {
    // تعديلات webpack إضافية
    return config;
  },
}

export default nextConfig;
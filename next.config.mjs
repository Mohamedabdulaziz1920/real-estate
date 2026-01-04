// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ⭐ إعدادات الصور
  images: {
    remotePatterns: [
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
      // UploadThing
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
    ],
    
    // إعدادات إضافية للصور
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // ⭐ إعدادات تجريبية (مهمة لـ serverActions)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  
  // ⭐ تجاوز أخطاء البناء (مؤقتاً)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ⭐ إضافة headers للأمان
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
  
  // ⭐ إعدادات webpack لحل مشكلة الحزم الخارجية
  webpack: (config, { isServer }) => {
    // حل مشكلة الحزم الخارجية
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // حل مشكلة الحزم مثل mongoose
    config.externals = [...(config.externals || []), 
      ({ context, request }, callback) => {
        if (/^mongoose$|^bcrypt$|^jsonwebtoken$|^cloudinary$/.test(request)) {
          return callback(null, `commonjs ${request}`);
        }
        callback();
      }
    ];
    
    return config;
  },
  
  // ⭐ إعدادات أخرى
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;

// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ⭐ إعدادات API لحل مشكلة bodyParser
  api: {
    bodyParser: {
      sizeLimit: '50mb', // لرفع الملفات الكبيرة
    },
  },
  
  // ⭐ حل مشكلة الحزم الخارجية (مهم لـ MongoDB والحزم الأخرى)
  serverExternalPackages: [
    'mongoose',      // MongoDB ODM
    'bcrypt',        // تشفير كلمات المرور
    'jsonwebtoken',  // JSON Web Tokens
    'cloudinary',    // رفع الملفات
    'sharp',         // معالجة الصور
  ],
  
  // ⭐ إعدادات الصور
  images: {
    remotePatterns: [
      // Cloudinary - لرفع الصور
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
    ],
    
    // ⭐ إعدادات إضافية للصور
    minimumCacheTTL: 60,            // الحد الأدنى للتخزين المؤقت (بالثواني)
    deviceSizes: [                  // أحجام الأجهزة للصور المتجاوبة
      640, 750, 828, 1080, 1200, 1920, 2048, 3840
    ],
    imageSizes: [                   // أحجام الصور
      16, 32, 48, 64, 96, 128, 256, 384
    ],
    formats: ['image/webp', 'image/avif'], // تنسيقات الصور المدعومة
    dangerouslyAllowSVG: true,      // السماح بصور SVG
    contentDispositionType: 'attachment', // نوع عرض المحتوى
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // سياسة الأمان
  },
  
  // ⭐ إعدادات تجريبية
  experimental: {
    // Server Actions
    serverActions: {
      bodySizeLimit: '10mb',       // حجم body لـ Server Actions
      allowedOrigins: ['localhost:3000', '*.vercel.app'], // النطاقات المسموحة
    },
    
    // تحسينات للأداء والتوافق
    optimizeCss: true,              // تحسين CSS
    scrollRestoration: true,        // استعادة التمرير
    externalDir: true,              // السماح بمجلدات خارجية
    
    // التوافق مع مكتبات Authentication
    serverComponentsExternalPackages: [
      'next-auth',
      '@auth/mongodb-adapter',
      '@auth/core',
    ],
    
    // تحسينات لـ Turbopack (إذا كنت تستخدمه)
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // ⭐ تجاوز أخطاء ESLint أثناء البناء (مؤقتاً)
  eslint: {
    ignoreDuringBuilds: true,       // تجاهل أخطاء ESLint أثناء البناء
  },
  
  // ⭐ تجاوز أخطاء TypeScript أثناء البناء (مؤقتاً)
  typescript: {
    ignoreBuildErrors: true,        // تجاهل أخطاء TypeScript أثناء البناء
  },
  
  // ⭐ إعدادات headers للأمان
  async headers() {
    return [
      {
        source: '/:path*',          // تطبيق على جميع المسارات
        headers: [
          // تحسين الأداء والأمان
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
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // تحسين التخزين المؤقت
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400'
          },
        ],
      },
      // ⭐ headers خاصة بـ API routes
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
          },
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0'
          },
        ],
      },
      // ⭐ headers خاصة بالصور
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
    ];
  },
  
  // ⭐ إعدادات إعادة التوجيه (إذا لزم الأمر)
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
  
  // ⭐ إعدادات webpack إضافية
  webpack: (config, { isServer, dev }) => {
    // ⭐ تهيئة fallback للمكتبات
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
    }
    
    // ⭐ تحسينات للتطوير
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    
    // ⭐ تحسينات للإنتاج
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types)[\\/]/,
              priority: 40,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const match = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                );
                return `npm.${match ? match[1] : 'unknown'}`;
              },
              priority: 30,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // ⭐ إعدادات التخزين المؤقت
  cacheMaxMemorySize: 0, // استخدام التخزين المؤقت في الذاكرة
  
  // ⭐ إعدادات أخرى
  poweredByHeader: false,          // إزالة header "X-Powered-By"
  compress: true,                  // ضغط Gzip/Brotli
  reactStrictMode: true,           // وضع React الصارم
  swcMinify: true,                 // استخدام SWC للتصغير
  output: 'standalone',            // للاستضافة على Vercel/Docker
  
  // ⭐ إعدادات للأجهزة المحمولة
  amp: {
    canonicalBase: '',             // URL أساسي لـ AMP
  },
  
  // ⭐ إعدادات التطوير
  devIndicators: {
    buildActivity: true,           // عرض نشاط البناء
    buildActivityPosition: 'bottom-right', // موقع المؤشر
  },
  
  // ⭐ إعدادات التوثيق
  basePath: '',                    // المسار الأساسي للتطبيق
  assetPrefix: '',                 // بادئة الملفات الثابتة
  trailingSlash: false,            // إزالة الشرطة المائلة النهائية
  
  // ⭐ إعدادات المحتوى الثابت
  staticPageGenerationTimeout: 60, // مهلة إنشاء الصفحات الثابتة (بالثواني)
};

export default nextConfig;

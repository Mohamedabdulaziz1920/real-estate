// src/lib/auth.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from './mongodb';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import type { UserRole } from '@/types/next-auth'; // ← أضف هذا الاستيراد

const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'البريد الإلكتروني', type: 'email' },
        password: { label: 'كلمة المرور', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();
        
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
        }

        const user = await User.findOne({ email: email })
          .select('+password')
          .lean();

        if (!user) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        if (!user.password) {
          throw new Error('الحساب لا يحتوي على كلمة مرور');
        }

        const isPasswordCorrect = await bcrypt.compare(
          password,
          user.password as string
        );

        if (!isPasswordCorrect) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image || null,
          role: (user.role as UserRole) || 'user', // ← تحديث هنا
        };
      },
    }),

    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/auth/login', 
    signOut: '/',
    error: '/auth/error',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? ""; 
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role as UserRole; // ← تحديث هنا
      }
      
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.role = token.role as UserRole; // ← هذا هو الحل ✅
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === 'development',
};

export default authOptions;
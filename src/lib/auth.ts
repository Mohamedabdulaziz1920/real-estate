// إصدار مبسط بدون أنواع معقدة
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from './mongodb';
import User from '../models/User';
import bcrypt from 'bcryptjs';

// تعريف نوع مبسط
type AuthOptions = {
  providers: any[];
  session: any;
  secret?: string;
  pages?: any;
  callbacks?: any;
  debug?: boolean;
};

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'البريد الإلكتروني', type: 'email' },
        password: { label: 'كلمة المرور', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
        }

        const user = await User.findOne({ email: credentials.email })
          .select('+password')
          .lean();

        if (!user) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        // تأكد من وجود كلمة مرور
        if (!user.password) {
          throw new Error('الحساب لا يحتوي على كلمة مرور');
        }

        // تحقق من كلمة المرور
        const passwordHash = String(user.password);
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          passwordHash
        );

        if (!isPasswordCorrect) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image || null,
          role: user.role || 'user',
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET || 'default-secret-key',

  pages: {
    signIn: '/auth/sign-in', 
    signOut: '/',
    error: '/auth/error',
  },

  callbacks: {
    async jwt({ token, user, account, profile }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role;
      }
      
      return token;
    },

    async session({ session, token }: any) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.role = token.role;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === 'development',
};

export default authOptions;
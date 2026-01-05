// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      phone?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    role: string
    phone?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: string
    phone?: string
  }
}

// ✅ هذا مهم جداً لحل مشكلة الـ Adapter
declare module "@auth/core/adapters" {
  interface AdapterUser {
    id: string
    email: string
    emailVerified: Date | null
    name?: string | null
    image?: string | null
    role: string
    phone?: string
  }
}
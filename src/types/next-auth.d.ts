import { DefaultSession } from "next-auth";

// ✅ 1. Define and Export UserRole (Must match keys in permissions.ts)
export type UserRole = "user" | "agent" | "admin";

// 2. Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
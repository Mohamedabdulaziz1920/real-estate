
// src/middleware.ts
import { auth } from "@/auth.edge";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth && !req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};


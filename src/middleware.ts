import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const protectedRoutes = ["/home"];
  const publicRoutes = ["/", "/login", "/register"];
  console.log(req.nextUrl)
  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    if (req.cookies.has("auth_token")) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
    if (publicRoutes.includes(req.nextUrl.pathname)) {
      if (!req.cookies.has("auth_token")) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  }
  return NextResponse.next();
}

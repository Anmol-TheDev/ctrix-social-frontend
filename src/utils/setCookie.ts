import { NextResponse } from "next/server";

export async function setCookie(token:string) {
  const res = NextResponse.next();
  res.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    expires:59
  });
  return res;
    
}
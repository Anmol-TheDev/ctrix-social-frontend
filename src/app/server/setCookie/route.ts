import { NextResponse } from "next/server";
import type { NextRequest, } from "next/server";

export  async function POST(req: NextRequest,) {
        const body = await req.json();
        const token = body.token;
         
        if (!token) {
          return new NextResponse("No token found", { status: 400 });
        }

        const res = NextResponse.json({ message: "Cookie set successfully" });
        res.cookies.set({   
            name:"auth_token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, 
          });
        return res;
 }
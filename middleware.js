import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const config = {
    matcher: [
        "/dashboard/user/:path*",
        "/dashboard/admin/:path*",
        "/api/user/:path*",
        "/api/admin/:path*",
       
    ],
};

export default withAuth(
    async function middleware(req) {
        const url = req.nextUrl.pathname;
        const token = req.nextauth?.token;

    
        const userRole = token?.user?.role;

        if (url?.includes("/admin") && userRole !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (url?.includes("/user") && userRole !== "user") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                if (!token) {
                    return false;
                }
                return true;
            }
        }
    }
);

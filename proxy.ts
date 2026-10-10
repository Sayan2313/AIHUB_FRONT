import { NextRequest, NextResponse } from "next/server";
import { verifySession, COOKIE_NAME } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /models routes
    if (pathname.startsWith("/models")) {
        const sessionToken = request.cookies.get(COOKIE_NAME)?.value;

        if (!sessionToken) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        const session = await verifySession(sessionToken);
        if (!session) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // If user is logged in and tries to visit /login or /signup, redirect to home
    if (pathname === "/login" || pathname === "/signup") {
        const sessionToken = request.cookies.get(COOKIE_NAME)?.value;
        if (sessionToken) {
            const session = await verifySession(sessionToken);
            if (session) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/models/:path*", "/login", "/signup"],
};

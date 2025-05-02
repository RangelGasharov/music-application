import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const path = request.nextUrl.pathname;

    if (path.startsWith("/api/auth") || path === "/login") {
        return NextResponse.next();
    }

    if (!token || isTokenExpired(token) || token?.error === "RefreshAccessTokenError") {
        const url = new URL("/login", request.url);

        const response = NextResponse.redirect(url);

        response.cookies.set("next-auth.session-token", "", { maxAge: 0, path: "/" });
        response.cookies.set("__Secure-next-auth.session-token", "", { maxAge: 0, path: "/" });
        response.cookies.set("next-auth.callback-url", "", { maxAge: 0, path: "/" });

        return response;
    }

    return NextResponse.next();
}

function isTokenExpired(token: JWT | null): boolean {
    if (!token?.exp) return true;
    return Date.now() >= Number(token.exp) * 1000;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};
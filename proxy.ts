import jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";

type TokenPayload = { sub: string; role: string };

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  function redirectToLogin() {
    const loginUrl = new URL("/api/auth/discord/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!token) {
    return redirectToLogin();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ["HS256"],
    }) as TokenPayload;

    // Route pour admins
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Route pour modérateur et admins
    if (
      pathname.startsWith("/moderation") &&
      payload.role !== "admin" &&
      payload.role !== "moderator"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    // Si le token est invalide ou expiré: on supprime le cookie et on redirige vers le login
    const response = redirectToLogin();
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/moderation/:path*"],
};

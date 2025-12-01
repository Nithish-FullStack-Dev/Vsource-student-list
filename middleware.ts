import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { roleAccess } from "./utils/roleAccess";

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/api/auth/login-step1",
  "/api/auth/login-step2",
  "/api/auth/logout",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p)
  );

  if (isPublic) {
    if (token && pathname.startsWith("/auth/login")) {
      const decoded: any = jwt.decode(token);
      const role = decoded?.role;
      const redirectMap: Record<string, string> = {
        ADMIN: "/dashboard",
        SUB_ADMIN: "/student-registration",
        ACCOUNTS: "/transactions",
      };
      return NextResponse.redirect(
        new URL(redirectMap[role] || "/dashboard", req.url)
      );
    }
    return NextResponse.next();
  }

  if (!token) return redirectToLogin(req, pathname);

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const role = decoded?.role;
    const allowedRoutes = roleAccess[role] || [];
    const isAllowed =
      allowedRoutes.includes("*") ||
      allowedRoutes.some((route) => pathname.startsWith(route));

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch {
    const res = redirectToLogin(req, pathname);
    res.cookies.delete("token");
    return res;
  }
}

function redirectToLogin(req: NextRequest, currentPath: string) {
  const url = req.nextUrl.clone();
  url.pathname = "/auth/login";
  url.searchParams.set("from", currentPath);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

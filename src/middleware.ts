import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

const ADMIN_PUBLIC_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return updateSession(request, NextResponse.next({ request }), {
      protectedPrefix: "/admin",
      loginPath: "/admin/login",
      publicPaths: ADMIN_PUBLIC_PATHS,
    });
  }

  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  const intlResponse = intlMiddleware(request);

  if (intlResponse.headers.get("location")) {
    return intlResponse;
  }

  const isRussian = pathname === "/ru" || pathname.startsWith("/ru/");
  const localePrefix = isRussian ? "/ru" : "";
  const dashboardPrefix = `${localePrefix}/dashboard`;

  if (pathname.startsWith(dashboardPrefix)) {
    return updateSession(request, intlResponse, {
      protectedPrefix: dashboardPrefix,
      loginPath: `${localePrefix}/login`,
    });
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const PROTECTED_PREFIXES = ["/dashboard", "/api/protected"]

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const requiresAuth = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  if (!requiresAuth) {
    return NextResponse.next()
  }

  const token = await getToken({ req: request })
  if (token) {
    return NextResponse.next()
  }

  const redirectUrl = new URL("/login", request.url)
  redirectUrl.searchParams.set("callbackUrl", `${pathname}${search}`)
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
}

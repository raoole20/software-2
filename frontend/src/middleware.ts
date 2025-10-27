import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that don't require authentication
const PUBLIC_FILE = [
  '/auth',
  '/auth/login',
  '/api/auth',
  '/api',
  '/api/schema',
  '/api/schema/swagger-ui',
  '/api/schema/redoc',
  '/_next',
  '/static',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public files and API
  if (PUBLIC_FILE.some((p) => pathname.startsWith(p))) return NextResponse.next()

  // Check for next-auth session token cookie (next-auth.session-token or __Secure-next-auth.session-token)
  const hasSession = !!(req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token'))

  if (!hasSession) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

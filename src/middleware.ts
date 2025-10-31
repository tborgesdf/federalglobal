import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Apenas permitir todas as requisições passarem
  console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
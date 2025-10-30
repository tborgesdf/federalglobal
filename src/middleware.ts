import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  
  // Detectar tipo de acesso baseado no hostname
  const isAdmin = hostname.includes('admin.federalglobal') || 
                  hostname.includes('admin-federalglobal') ||
                  (hostname.includes('vercel.app') && url.searchParams.get('admin') === 'true')
  
  const isClient = hostname.includes('federalglobal') && !isAdmin
  
  // Log para debugging
  console.log(`[Middleware] Host: ${hostname}, Admin: ${isAdmin}, Client: ${isClient}`)
  
  // Redirecionar para interfaces específicas
  if (isAdmin) {
    // Se está tentando acessar área admin
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`
      return NextResponse.rewrite(url)
    }
  } else if (isClient) {
    // Se está tentando acessar área cliente
    if (url.pathname.startsWith('/admin')) {
      url.pathname = '/client'
      return NextResponse.rewrite(url)
    }
    if (!url.pathname.startsWith('/client') && url.pathname !== '/') {
      url.pathname = `/client${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }
  
  // Headers para identificação
  const response = NextResponse.next()
  response.headers.set('x-domain-type', isAdmin ? 'admin' : 'client')
  response.headers.set('x-hostname', hostname)
  
  return response
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
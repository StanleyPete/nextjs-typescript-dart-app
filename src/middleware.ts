import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
   const pathname = request.nextUrl.pathname

   const protectedRoutes = ['/game-classic', '/game-cricket', '/game-online']

   if (protectedRoutes.includes(pathname)) {
      const referer = request.headers.get('referer')
      const origin = request.nextUrl.origin
      const accessGrantedCookie = request.cookies.get('dart-app')

      if (!referer || !referer.startsWith(`${origin}/`) || !accessGrantedCookie) {
         return NextResponse.redirect(new URL('/', request.url))
      }
   }

   return NextResponse.next()
}

export const config = {
   matcher: ['/game-classic', '/game-cricket', '/game-online'],
}

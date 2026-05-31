import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_EMAIL = '34johnertan@gmail.com'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('sb-access-token')?.value ||
                  request.cookies.getAll().find(c => c.name.includes('auth-token'))?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login?next=/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}

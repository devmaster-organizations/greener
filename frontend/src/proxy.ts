import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE } from './lib/auth-constants';

export default function proxy(request: NextRequest) {
  if (request.cookies.has(AUTH_COOKIE)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

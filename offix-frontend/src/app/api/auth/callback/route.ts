import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    // If no token is provided, redirect to login with an error
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }

  // Set the token as an HttpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Secure only in production
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });

  // Redirect to the home page (dashboard)
  return NextResponse.redirect(new URL('/', request.url));
}

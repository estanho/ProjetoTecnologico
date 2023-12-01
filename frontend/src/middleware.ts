import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    if (req.nextUrl.pathname === '/auth/login') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    let { data: result, error } = await supabase
      .from('users')
      .select('first_login')
      .eq('id', user.id)
      .single();

    if (result?.first_login) {
      return NextResponse.redirect(new URL('/auth/signup-oauth', req.url));
    }

    if (
      req.nextUrl.pathname.startsWith('/driver') &&
      user.user_metadata.role !== 'DriverRole'
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (
      req.nextUrl.pathname.startsWith('/student') &&
      user.user_metadata.role !== 'StudentRole'
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (
      req.nextUrl.pathname.startsWith('/responsible') &&
      user.user_metadata.role !== 'ResponsibleRole'
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/',
    '/account',
    '/driver/(.*)',
    '/responsible/(.*)',
    '/student/(.*)',
  ],
};

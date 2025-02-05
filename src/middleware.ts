import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Se estiver na página inicial, redireciona para /cronograma
    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/cronograma', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/cronograma',
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/cronograma/registro',
    '/api/cronograma/protected/:path*',
    '/cronograma/dashboard',
  ],
}; 
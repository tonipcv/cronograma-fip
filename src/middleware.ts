import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Se estiver na página inicial, redireciona para /cronograma
    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/cronograma', req.url));
    }

    // Permite acesso à página de registro
    if (req.nextUrl.pathname === '/cronograma/registro') {
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permite acesso à página de registro sem autenticação
        if (req.nextUrl.pathname === '/cronograma/registro') {
          return true;
        }
        // Para outras rotas, requer autenticação
        return !!token;
      },
    },
    pages: {
      signIn: '/cronograma',
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/cronograma',
    '/api/cronograma/protected/:path*',
    '/cronograma/dashboard',
  ],
}; 
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET must be set");
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        cpf: { label: "CPF", type: "text" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.cpf) {
            throw new Error('Email e CPF são obrigatórios');
          }

          // Remove caracteres especiais do CPF
          const formattedCPF = credentials.cpf.replace(/\D/g, '');

          const user = await prisma.cronograma.findFirst({
            where: {
              AND: [
                { email: credentials.email.toLowerCase() },
                { cpf: formattedCPF }
              ]
            }
          });

          if (!user) {
            throw new Error('Email ou CPF inválidos');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            enrollmentDate: user.enrollmentDate,
          };
        } catch (error) {
          console.error('Erro na autorização:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: '/cronograma',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.enrollmentDate = user.enrollmentDate;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.enrollmentDate = token.enrollmentDate as Date;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }; 
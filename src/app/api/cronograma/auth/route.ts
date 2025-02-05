import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, cpf } = await request.json();

    if (!email || !cpf) {
      return NextResponse.json(
        { error: 'Email e CPF são obrigatórios' },
        { status: 400 }
      );
    }

    // Remove caracteres especiais do CPF
    const formattedCPF = cpf.replace(/\D/g, '');

    const user = await prisma.cronograma.findFirst({
      where: {
        AND: [
          { email: email.toLowerCase() },
          { cpf: formattedCPF }
        ]
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou CPF inválidos' },
        { status: 401 }
      );
    }

    // Remove dados sensíveis antes de retornar
    const { cpf: userCpf, ...userWithoutSensitiveData } = user;

    return NextResponse.json({
      user: userWithoutSensitiveData
    });

  } catch (error) {
    console.error('Erro na autenticação:', error);
    return NextResponse.json(
      { error: 'Erro ao autenticar usuário' },
      { status: 500 }
    );
  }
} 
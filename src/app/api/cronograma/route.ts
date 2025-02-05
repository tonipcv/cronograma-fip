import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Interface para o erro do Prisma
interface PrismaError extends Error {
  code?: string;
  meta?: {
    target?: string[];
  };
}

export async function POST(request: Request) {
  try {
    // Verifica o content-type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Erro de content-type:', {
        received: contentType,
        expected: 'application/json'
      });
      return NextResponse.json(
        { error: 'Content type must be application/json' },
        { status: 400 }
      );
    }

    // Parse do body
    const body = await request.json();
    const { name, email, password, cpf, whatsapp, instagram, enrollmentDate } = body;

    // Log detalhado dos dados recebidos
    console.log('\n=== TENTATIVA DE CADASTRO ===');
    console.log('Dados recebidos:', {
      name,
      email,
      cpf,
      whatsapp,
      instagram,
      enrollmentDate,
      password: '***',
      headers: Object.fromEntries(request.headers.entries())
    });

    // Validações detalhadas
    const camposFaltantes = [];
    if (!name) camposFaltantes.push('name');
    if (!email) camposFaltantes.push('email');
    if (!password) camposFaltantes.push('password');
    if (!cpf) camposFaltantes.push('cpf');
    if (!whatsapp) camposFaltantes.push('whatsapp');
    if (!enrollmentDate) camposFaltantes.push('enrollmentDate');

    if (camposFaltantes.length > 0) {
      console.error('Campos obrigatórios faltando:', {
        camposFaltantes,
        dadosRecebidos: {
          name: !!name,
          email: !!email,
          password: !!password,
          cpf: !!cpf,
          whatsapp: !!whatsapp,
          enrollmentDate: !!enrollmentDate
        }
      });
      return NextResponse.json(
        { 
          error: 'Todos os campos obrigatórios devem ser preenchidos',
          camposFaltantes 
        },
        { status: 400 }
      );
    }

    // Formata e valida o CPF
    const formattedCPF = cpf.replace(/\D/g, '');
    console.log('CPF formatado:', {
      original: cpf,
      formatado: formattedCPF,
      valido: formattedCPF.length === 11
    });

    if (formattedCPF.length !== 11) {
      return NextResponse.json(
        { error: 'CPF inválido - deve conter 11 dígitos' },
        { status: 400 }
      );
    }

    // Formata e valida o email
    const formattedEmail = email.toLowerCase().trim();
    console.log('Email formatado:', {
      original: email,
      formatado: formattedEmail
    });

    // Verifica email existente
    const existingEmail = await prisma.cronograma.findUnique({
      where: { email: formattedEmail }
    });

    if (existingEmail) {
      console.log('Email já cadastrado:', {
        emailTentativa: formattedEmail,
        usuarioExistente: {
          id: existingEmail.id,
          createdAt: existingEmail.createdAt
        }
      });
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      );
    }

    // Verifica CPF existente
    const existingCPF = await prisma.cronograma.findUnique({
      where: { cpf: formattedCPF }
    });

    if (existingCPF) {
      console.log('CPF já cadastrado:', {
        cpfTentativa: formattedCPF,
        usuarioExistente: {
          id: existingCPF.id,
          createdAt: existingCPF.createdAt
        }
      });
      return NextResponse.json(
        { error: 'CPF já cadastrado' },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Senha processada com sucesso');

    // Prepara os dados para criação
    const userData = {
      name: name.trim(),
      email: formattedEmail,
      password: hashedPassword,
      cpf: formattedCPF,
      whatsapp: whatsapp.replace(/\D/g, ''),
      instagram: instagram?.trim() || null,
      enrollmentDate: new Date(enrollmentDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Tentando criar usuário com dados:', {
      ...userData,
      password: '***'
    });

    // Cria o usuário
    const customer = await prisma.cronograma.create({
      data: userData,
    });

    console.log('\n=== USUÁRIO CRIADO COM SUCESSO ===');
    console.log('Detalhes:', {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      createdAt: customer.createdAt
    });

    // Remove a senha do retorno
    const { password: _, ...customerWithoutPassword } = customer;

    return NextResponse.json({
      success: true,
      customer: customerWithoutPassword
    }, {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: unknown) {
    console.error('\n=== ERRO NO CADASTRO ===');
    
    // Trata o erro como PrismaError
    const prismaError = error as PrismaError;
    
    console.error('Detalhes do erro:', {
      message: prismaError.message,
      code: prismaError.code,
      name: prismaError.name,
      stack: prismaError.stack,
      prismaError: prismaError.meta,
    });
    
    // Verifica se é um erro do Prisma
    if (prismaError.code) {
      switch (prismaError.code) {
        case 'P2002':
          const field = prismaError.meta?.target?.[0];
          console.error('Erro de unicidade:', {
            campo: field,
            detalhes: prismaError.meta
          });
          return NextResponse.json(
            { 
              error: `${field === 'email' ? 'Email' : 'CPF'} já cadastrado`,
              field 
            },
            { status: 400 }
          );
        default:
          console.error('Erro do Prisma não tratado:', {
            code: prismaError.code,
            meta: prismaError.meta
          });
          return NextResponse.json(
            { 
              error: 'Erro ao criar usuário',
              details: prismaError.message
            },
            { status: 500 }
          );
      }
    }

    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: prismaError.message
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.toLowerCase();
    const cpf = searchParams.get('cpf')?.replace(/\D/g, '');

    if (!email && !cpf) {
      return NextResponse.json(
        { error: 'Email ou CPF deve ser fornecido' },
        { status: 400 }
      );
    }

    // Define o tipo correto para a condição OR
    const where: {
      OR: { email: string }[] | { cpf: string }[]
    } = {
      OR: []
    };

    if (email) {
      where.OR = [...where.OR, { email }] as { email: string }[];
    }
    if (cpf) {
      where.OR = [...where.OR, { cpf }] as { cpf: string }[];
    }

    const customer = await prisma.cronograma.findFirst({ where });

    return NextResponse.json({
      exists: !!customer,
      customer: customer ? {
        ...customer,
        password: undefined
      } : null,
      field: customer ? (customer.email === email ? 'email' : 'cpf') : null
    });

  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar usuário' },
      { status: 500 }
    );
  }
} 
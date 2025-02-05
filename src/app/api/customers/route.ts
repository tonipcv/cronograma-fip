import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, cpf, whatsapp, instagram, enrollmentDate } = body;

    // Validações básicas
    if (!name || !email || !cpf || !whatsapp || !enrollmentDate) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    // Formata o CPF (remove caracteres especiais)
    const formattedCPF = cpf.replace(/\D/g, '');

    // Verifica se já existe um cliente com este email
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email },
          { cpf: formattedCPF }
        ]
      }
    });

    if (existingCustomer) {
      if (existingCustomer.email === email) {
        return NextResponse.json(
          { error: 'Email já cadastrado' },
          { status: 400 }
        );
      }
      if (existingCustomer.cpf === formattedCPF) {
        return NextResponse.json(
          { error: 'CPF já cadastrado' },
          { status: 400 }
        );
      }
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email: email.toLowerCase(),
        cpf: formattedCPF,
        whatsapp,
        instagram,
        enrollmentDate: new Date(enrollmentDate),
      },
    });

    return NextResponse.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Erro ao criar cliente' },
      { status: 500 }
    );
  }
}

// Rota para verificar se um email ou CPF já existe
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const cpf = searchParams.get('cpf');

  if (!email && !cpf) {
    return NextResponse.json(
      { error: 'Email ou CPF deve ser fornecido' },
      { status: 400 }
    );
  }

  try {
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email: email?.toLowerCase() },
          { cpf: cpf?.replace(/\D/g, '') }
        ].filter(Boolean)
      }
    });

    return NextResponse.json({
      exists: !!customer,
      field: customer ? (customer.email === email ? 'email' : 'cpf') : null
    });
  } catch (error) {
    console.error('Error checking customer:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar cliente' },
      { status: 500 }
    );
  }
} 
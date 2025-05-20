import { prisma } from '@/lib/utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createItemSchema = z.object({
  name: z.string().min(1, "O nome do item é obrigatório"),
  type: z.string().min(1, "O tipo do item é obrigatório"),
  qtd: z.number().min(1, "A quantidade deve ser maior que 0"),
  value: z.number().min(0.01, "O valor deve ser maior que 0"),
  flavor: z.string().min(1, "O sabor é obrigatório"),
});


const deleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, "Pelo menos um ID é necessário"),
});


const getStatusFromQuantity = (qtd: number): string => {
  if (qtd === 0) return "Em Falta";
  if (qtd < 10) return "Pouco";
  if (qtd <= 25) return "Suficiente";
  return "Completo";
};

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });
    return NextResponse.json(items, { status: 200 });
  } catch (error: unknown) {
    console.error('Erro ao buscar itens:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar itens' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createItemSchema.parse(body); 

    const status = getStatusFromQuantity(data.qtd);

    const newItem = await prisma.item.create({
      data: {
        name: data.name,
        type: data.type,
        qtd: data.qtd,
        value: data.value,
        flavor: data.flavor,
        status, 
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: unknown) {
    console.error('Erro ao criar item:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Erro ao criar item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { ids } = deleteSchema.parse(body);

    const result = await prisma.item.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json(
      { message: 'Itens deletados com sucesso', deletedCount: result.count },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Erro ao deletar itens:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Erro ao deletar itens' },
      { status: 500 }
    );
  }
}
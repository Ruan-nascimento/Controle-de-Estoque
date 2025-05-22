import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getStatusFromQuantity } from '../route';

const prisma = new PrismaClient();

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const { id } = params; 
    const updatedFields = await request.json();

    const existingItem = await prisma.item.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
    }

    const status = getStatusFromQuantity(updatedFields.qtd)

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        ...updatedFields,
        status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar item' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
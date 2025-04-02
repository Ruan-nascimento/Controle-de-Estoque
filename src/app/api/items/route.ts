import { prisma } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar itens' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
    try {
      const { ids } = await request.json();
  
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json(
          { error: 'Nenhum ID fornecido ou formato inválido' },
          { status: 400 }
        );
      }
  
      await prisma.item.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
  
      return NextResponse.json(
        { message: 'Itens deletados com sucesso' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Erro ao deletar itens:', error);
      return NextResponse.json(
        { error: 'Erro ao deletar itens' },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }
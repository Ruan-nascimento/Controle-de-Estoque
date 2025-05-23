import { prisma } from "@/lib/utils";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const items = await prisma.item.findMany({
      where: {
        status: 'Pouco'
      },
      orderBy: {
        qtd: 'desc',
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